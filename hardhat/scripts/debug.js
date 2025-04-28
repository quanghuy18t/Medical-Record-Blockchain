const { ethers, network } = require("hardhat");

async function main() {
  const yourContract = await ethers.getContractAt("Medical", "0x4ADf86464e128768D77612133550E60C483D5e00");
  
  const signer = await ethers.getSigner("0xC13c42CEDb1107ACBE595beD743ec98C7827D111");
  
  try {
    const appointmentID = 1;
    
    if (yourContract.debugValues) {
      const values = await yourContract.connect(signer).debugValues(appointmentID);
      console.log("appointmentCount:", values.appointmentCount_.toString());
      console.log("appointmentDoctorID:", values.appointmentDoctorID.toString());
      console.log("senderDoctorID:", values.senderDoctorID.toString());
      console.log("appointmentIsOpen:", values.appointmentIsOpen);
      console.log("senderIsDoctor:", values.senderIsDoctor);
    }
    
    await yourContract.connect(signer).COMPLETE_APPOINTMENT(appointmentID);
    console.log("Giao dịch thành công!");
  } catch (error) {
    console.log("Lỗi gọi hàm COMPLETE_APPOINTMENT:");
    console.log(error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });