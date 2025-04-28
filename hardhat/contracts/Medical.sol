// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Medical {
  struct User {
    string name;
    string userType;
  }

  struct Doctor {
    uint id;
    address walletAddress;
    string ipfs;
    // string name;
    // bool gender; //0: Male, 1: Female
    // string birth;
    // string degree;
    // string yourAddress;
    // string phone;
    // string email;
    // string designation;
    // string specialization;
    // string biography;
    uint appointmentCount;
    uint successfulTreatmentCount;
    bool isApprove;
  }

  // struct Appointment {
  //   uint id;
  //   uint patientID;
  //   uint doctorID;
  //   string appointmentDate;
  //   uint day;
  //   string from;
  //   string to;
  //   string condition;
  //   bool isOpen;
  // }

  struct Patient {
    uint id;
    address walletAddress;
    string ipfs;
    // string name;
    // string birth;
    // bool gender; //0:Male 1:Female
    // string phone;
    // string email;
    // string yourAddress;
    // string insurance;
    // string notes;
    bool isApprove;
  }

  struct MedicalInfo {
    uint id;
    uint patientID;
    uint doctorID;
    string hospitalName;
    string symptoms;
    string diagnosis;
    uint[] tests;
    uint[] prescriptions;
    uint date;
  }

  struct Test {
    uint id;
    uint patientID;
    uint doctorID;
    string typeOfTest;
    uint date;
    string result;
    string[] images;
    string diagnosis;
    string notes;
  }

  struct Prescription {
    uint id;
    uint patientID;
    uint doctorID;
    string[] medications;
    uint date;
  }

  mapping (address => User) public userList;
  mapping (uint => Doctor) public doctors;
  mapping (uint => Patient) public patients;
  mapping (uint => MedicalInfo) public medicals;
  mapping (uint => Test) public tests;
  mapping (uint => Prescription) public prescriptions;

  mapping (address => bool) public registeredDoctors;
  mapping (address => bool) public registeredPatients;

  uint public doctorCount;
  uint public patientCount;
  uint public medicalCount;
  uint public testCount;
  uint public prescriptionCount;

  address payable public admin;
  uint public registrationDoctorFee = 0.0025 ether;
  uint public registrationPatientFee = 0.0025 ether;
  uint public appointmentFee = 0.0025 ether;
  uint public medicalFee = 0.0025 ether;
  uint public testFee = 0.0025 ether;

  //DOCTOR
  event ADDED_DOCTOR(uint _id, address _walletAddress, string _ipfs_url);
  event APPROVED_DOCTOR(uint _id, bool _isApprove);
  
  //PATIENT
  event ADDED_PATIENT(uint _id, address _walletAddress, string _ipfs_url);
  event APPROVED_PATIENT(uint _patientID, bool _isApprove);

  //MEDICAL INFO
  event ADDED_MEDICAL(uint _id, uint _patientID, string _hospitalName, uint _date);

  //TEST
  event ADDED_TEST(uint _id, string _typeOfTest, uint _date);
  event COMPLETED_TEST(uint _id, string _typeOfTest, string _result, string _diagnosis, bool _status);

  //PRESCRIPTION
  event ADDED_PRESCRIPTION(uint _id, uint _patientID, uint date);

  modifier onlyAdmin() {
    require(msg.sender == admin, "Only admin can perform this action");
    _;
  }
  modifier onlyDoctor() {
    require(registeredDoctors[msg.sender], "Only registered doctor can perform this action");
    _;
  }

  constructor() {
    admin = payable (msg.sender);
    CREATE_ACCOUNT("quanghuy", admin, "Admin");
  }

  //CHECK USER EXIST
  function CHECK_USER_EXIST(address public_key) public view returns(bool) {
    return bytes(userList[public_key].name).length > 0;
  }

  //CREATE ACCOUNT
  function CREATE_ACCOUNT(string memory name, address _walletAddress, string memory _type) internal {
    require(CHECK_USER_EXIST(_walletAddress) == false, "User already exist");
    require(bytes(name).length > 0, "Username cannot be empty");

    userList[_walletAddress].name = name;
    userList[_walletAddress].userType = _type;
  }

  function GET_USERNAME_TYPE(address public_key) external view returns(User memory) {
    require(CHECK_USER_EXIST(public_key), "User is not registered");

    return userList[public_key];
  }

  //------------DOCTOR----------------
  //ADD DOCTOR
  function ADD_DOCTOR(address _walletAddress, string memory _name, string memory _ipfs_url, string memory _type) public payable {
    require(msg.value == registrationDoctorFee, "Incorrect registration fee");
    require(!registeredDoctors[_walletAddress], "Doctor is already registered");

    doctorCount++;
    doctors[doctorCount] = Doctor(
      doctorCount,
      _walletAddress,
      _ipfs_url,
      0,
      0,
      false
    );
    registeredDoctors[_walletAddress] = true;

    payable(admin).transfer(msg.value);

    CREATE_ACCOUNT(_name, _walletAddress, _type);

    emit ADDED_DOCTOR(doctorCount, _walletAddress, _ipfs_url);
  }

  //APPROVE DOCTOR
  function APPROVE_DOCTOR(uint _doctorID) public onlyAdmin {
    require(_doctorID <= doctorCount, "Doctor does not exist");
    require(!doctors[_doctorID].isApprove, "Doctor is already approved");

    doctors[_doctorID].isApprove = true;

    emit APPROVED_DOCTOR(_doctorID, doctors[_doctorID].isApprove);
  }

  //GET ALL REGISTERED DOCTOR
  function GET_ALL_REGISTERED_DOCTOR() public view returns(Doctor[] memory) {
    Doctor[] memory doctorList = new Doctor[](doctorCount);
    uint count = 0;

    for (uint i = 1; i <= doctorCount; i++) {
      doctorList[count++] = doctors[i];
    }

    return doctorList;
  }

  //GET ALL APPROVED DOCTOR
  function GET_ALL_APPROVED_DOCTOR() public view returns(Doctor[] memory) {
    uint count = 0;
    for (uint i = 1; i <= doctorCount; i++) {
      if (doctors[i].isApprove == true) {
        count++;
      }
    }

    uint counter = 0;
    Doctor[] memory doctorList = new Doctor[](count);
    for (uint i = 1; i <= doctorCount; i++) {
      if (doctors[i].isApprove == true) {
        doctorList[counter++] = doctors[i];
      }
    }

    return doctorList;
  }

  //GET DOCTOR ID
  function GET_DOCTOR_ID(address _doctorAddress) public view returns(uint) {
    for (uint i = 1; i <= doctorCount; i++) {
      if (doctors[i].walletAddress == _doctorAddress) {
        return i;
      }
    }

    revert("Doctor not found");
  }

  function GET_DOCTOR_DETAIL(uint _doctorID) public view returns(Doctor memory) {
    return doctors[_doctorID];
  }

  //---------------PATIENT--------------
  //ADD PATIENT
  function ADD_PATIENT(address _walletAddress, string memory _name, string memory _ipfs_url, string memory _type) public payable {
    require(msg.value == registrationPatientFee, "Incorrect registration fee");
    require(!registeredPatients[_walletAddress], "Patient is already registered");

    patientCount++;
    patients[patientCount] = Patient(
      patientCount,
      _walletAddress,
      _ipfs_url,
      false
    );
    registeredPatients[_walletAddress] = true;

    payable(admin).transfer(msg.value);
    CREATE_ACCOUNT(_name, _walletAddress, _type);

    emit ADDED_PATIENT(patientCount, _walletAddress, _ipfs_url);
  }

  //APPROVE PATIENT
  function APPROVE_PATIENT(uint _patientID) public onlyAdmin {
    require(_patientID <= patientCount, "Patient does not exist");
    require(!patients[_patientID].isApprove, "Patient is already approved");

    patients[_patientID].isApprove = true;

    emit APPROVED_PATIENT(_patientID, patients[_patientID].isApprove);
  }

  //GET ALL PATIENT REGISTERED
  function GET_ALL_REGISTERED_PATIENT() public view returns(Patient[] memory) {
    Patient[] memory patientList = new Patient[](patientCount);

    uint count = 0;
    for (uint i = 1; i <= patientCount; i++) {
      patientList[count++] = patients[i];
    }

    return patientList;
  }

  //GET ALL APPROVED PATIENT
  function GET_ALL_APPROVED_PATIENT() public view returns(Patient[] memory) {
    uint count = 0;
    for (uint i = 1; i <= patientCount; i++) {
      if (patients[i].isApprove == true) {
        count++;
      }
    }

    uint counter = 0;
    Patient[] memory patientList = new Patient[](count);
    for (uint i = 1; i <= patientCount; i++) {
      if (patients[i].isApprove == true) {
        patientList[counter++] = patients[i];
      }
    }

    return patientList;
  }

  //GET PATIENT ID
  function GET_PATIENT_ID(address _patientAddress) public view returns(uint) {
    for (uint i = 1; i <= patientCount; i++) {
      if (patients[i].walletAddress == _patientAddress) {
        return i;
      }
    }
    
    revert("Patient not found");
  }

  function GET_PATIENT_DETAIL(uint _patientID) public view returns(Patient memory) {
    return patients[_patientID];
  }

  //------------------MEDICAL----------------------
  //ADD MEDICAL
  function ADD_MEDICAL(
    uint _patientID,
    string memory _hospitalName,
    string memory _symptoms,
    string memory _diagnosis,
    uint[] memory _tests,
    uint[] memory _prescription
  ) public payable onlyDoctor {
    require(msg.value == medicalFee, "Incorrect registration fee");
    require(_patientID <= patientCount, "Patient does not exist");

    medicalCount++;
    medicals[medicalCount] = MedicalInfo(
      medicalCount,
      _patientID,
      GET_DOCTOR_ID(msg.sender),
      _hospitalName,
      _symptoms,
      _diagnosis,
      _tests,
      _prescription,
      block.timestamp
    );

    payable(admin).transfer(msg.value);
    emit ADDED_MEDICAL(medicalCount, _patientID, _hospitalName, block.timestamp);
  }

  //GET ALL PATIENT MEDICAL
  function GET_ALL_PATIENT_MEDICAL(uint _patientID) public view returns(MedicalInfo[] memory) {
    require(_patientID <= patientCount, "Patient does not exist");

    uint count = 0;
    for (uint i = 1; i <= medicalCount; i++) {
      if (medicals[i].patientID == _patientID) {
        count++;
      }
    }

    MedicalInfo[] memory medicalList = new MedicalInfo[](count);
    uint counter = 0;
    for (uint i = 1; i <= medicalCount; i++) {
      if (medicals[i].patientID == _patientID) {
        medicalList[counter] = medicals[i];
        counter++;
      }
    }

    return medicalList;
  }

  //GET MEDICAL DETAIL
  function GET_MEDICAL_DETAIL(uint _medicalID) public view returns(MedicalInfo memory) {
    return medicals[_medicalID];
  }

  //-------------------TEST----------------------
  function ADD_TEST(
    uint _patientID, 
    string memory _typeOfTest, 
    string memory _result,
    string[] memory images, 
    string memory _diagnosis,
    string memory _notes
    ) public payable onlyDoctor() {
    require(_patientID <= patientCount, "Patient does not exist");
    require(msg.value == testFee, "Incorrect test fee");

    uint _doctorID = GET_DOCTOR_ID(msg.sender);
    testCount++;
    tests[testCount] = Test(
      testCount,
      _patientID,
      _doctorID,
      _typeOfTest,
      block.timestamp,
      _result,
      images,
      _diagnosis,
      _notes
    );

    payable(admin).transfer(msg.value);
    emit ADDED_TEST(testCount, _typeOfTest, block.timestamp);
  }

  //GET TEST DETAIL
  function GET_TEST_DETAIL(uint _testID) public view returns(Test memory) {
    require(_testID <= testCount, "Test does not exist");

    return tests[_testID];
  }

  //GET ALL TEST
  function GET_ALL_TEST() public onlyAdmin view returns(Test[] memory) {
    Test[] memory result = new Test[](testCount);

    uint count = 0;
    for (uint i = 0; i <= testCount; i++) {
      result[count++] = tests[i];
    }

    return result;
  }

  //GET ALL DOCTOR TEST
  function GET_ALL_DOCTOR_TEST(uint _doctorID) public view returns(Test[] memory) {
    require(_doctorID <= doctorCount, "Doctor is not exist");

    uint count = 0;
    for (uint i = 1; i <= testCount; i++) {
      if (tests[i].doctorID == _doctorID) {
        count++;
      }
    }

    Test[] memory result = new Test[](count);
    uint counter = 0;
    for (uint i = 1; i <= testCount; i++) {
      if (tests[i].doctorID == _doctorID) {
        result[counter] = tests[i];
        counter++;
      }
    }

    return result;
  }

  //GET ALL PATIENT TEST
  function GET_ALL_PATIENT_TEST(uint _patientID) public view returns(Test[] memory) {
    require(_patientID <= patientCount, "Doctor is not exist");

    uint count = 0;
    for (uint i = 1; i <= testCount; i++) {
      if (tests[i].patientID == _patientID) {
        count++;
      }
    }

    Test[] memory result = new Test[](count);
    uint counter = 0;
    for (uint i = 1; i <= testCount; i++) {
      if (tests[i].patientID == _patientID) {
        result[counter] = tests[i];
        counter++;
      }
    }

    return result;
  }

  //ADD PRESCRIPTION
  function ADD_PRESCRIPTION(uint _patientID, string[] memory _medications) public onlyDoctor {
    require(_patientID <= patientCount, "Patient does not exist");

    prescriptionCount++;
    prescriptions[prescriptionCount] = Prescription(
      prescriptionCount,
      _patientID,
      GET_DOCTOR_ID(msg.sender),
      _medications,
      block.timestamp
    );

    emit ADDED_PRESCRIPTION(prescriptionCount, _patientID, block.timestamp);
  }

  //GET PRESCRIPTION OF PATIENT
  function GET_PRESCRIPTION_OF_PATIENT() public view returns (Prescription[] memory) {
    require(GET_PATIENT_ID(msg.sender) <= patientCount, "Patient does not exist");

    uint _patientID = GET_PATIENT_ID(msg.sender);
    uint count = 0;
    for (uint i = 1; i <= prescriptionCount; i++) {
      if (prescriptions[i].patientID == _patientID) {
        count++;
      }
    }

    uint counter = 0;
    Prescription[] memory prescriptionList = new Prescription[](count);
    for (uint i = 1; i <= prescriptionCount; i++) {
      if (prescriptions[i].patientID == _patientID) {
        prescriptionList[counter++] = prescriptions[i];
      }
    }

    return prescriptionList;
  }

  //GET PRESCRIPTION OF DOCTOR
  function GET_PRESCRIPTION_OF_DOCTOR() public onlyDoctor view returns(Prescription[] memory) {
    require(GET_DOCTOR_ID(msg.sender) <= doctorCount, "Doctor does not exist");

    uint _doctorID = GET_DOCTOR_ID(msg.sender);
    uint count = 0;
    for (uint i = 1; i <= prescriptionCount; i++) {
      if (prescriptions[i].doctorID == _doctorID) {
        count++;
      }
    }

    uint counter = 0;
    Prescription[] memory prescriptionList = new Prescription[](count);
    for (uint i = 1; i <= prescriptionCount; i++) {
      if (prescriptions[i].doctorID == _doctorID) {
        prescriptionList[counter++] = prescriptions[i];
      }
    }

    return prescriptionList;
  }

  //GET PRESCTIPTION DETAIL
  function GET_PRESCRIPTION_DETAIL(uint _prescriptionID) public view returns(Prescription memory) {
    require(_prescriptionID <= prescriptionCount, "Prescription does not exist");

    return prescriptions[_prescriptionID];
  }
}