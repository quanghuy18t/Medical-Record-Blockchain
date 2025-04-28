# **Private Ethereum Network for Hospital Management**

### **Introduction**

This project builds a **private Ethereum network** using **Geth** to store and manage important hospital data, including personal information of doctors, patients, and medical records. This data is securely stored on a private Ethereum network with smart contracts written in **Solidity**.

### **System Features**

- **Personal Information Registration**:
  - Doctors and patients can register their personal information and await approval from the administrator.

- **Admin Approval**:
  - The admin can review and approve the registered information for doctors and patients.

- **Appointment Scheduling**:
  - The admin can schedule doctor appointments and assign suitable times for patients.

- **Patient Appointment Booking**:
  - Patients can select doctors and available time slots to book their appointments.

- **Medical History Storage**:
  - After a consultation, the doctor can update and store the patient's medical history on the private Ethereum network.

### **Technologies Used**

- **Geth**: Set up and deploy a private Ethereum network to store hospital data.
- **Solidity**: Write smart contracts to handle operations like information registration, appointment scheduling, and storing medical records.
- **Web3**: Interact with the Ethereum blockchain from the client-side application.
- **Node.js**: Build the **RESTful API** that connects the front-end application with the private Ethereum network, handling backend operations.
- **Next.js**: Create the **front-end interface** for users (patients, doctors, and administrators) to interact with the system.

### **Setup Instructions**

1. **Install Geth**:
   - Instructions to install and configure Geth to create a private Ethereum network.

2. **Deploy Smart Contracts**:
   - Deploy smart contracts written in Solidity for various system functionalities.

3. **Connect to the Blockchain**:
   - Connect the application to the Ethereum network via Web3.js or Web3Modal to interact with the smart contracts.

### **How It Works**

1. Patients and doctors register their personal information via the user interface.
2. The admin reviews and approves the registration details.
3. The admin schedules doctor appointments for patients.
4. Patients select a doctor and book an appointment.
5. After the consultation, the doctor stores the patient's medical history on the Ethereum network.

