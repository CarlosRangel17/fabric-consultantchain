# fabric-consultantchain

10-09-2018
- Blockchain for Client and Consultant Network 
- Powered by Hyperledger Fabric

 TABLE OF CONTENT
---------------------------------------------------------------------------------------------------------------------
- Pre-requisites
- Get Started
- Industry Overview 
- How industry operates / industry description
- Industry Problem(s) 
- Current issues within network 
- How Blockchain Disrupts Industry 
- Problems solved 
- Improvements to industry
- Peer Overview 
- Defining Actors 
- Defining Chaincodes 
- Key components and Transaction Flow
- Actor & Chaincode Walkthrough
- Conclusions & Objectives
----------------------------------------------------------------------------------------------------------------

# Pre-requisites 
1. Install docker [here](https://docs.docker.com/get-docker)
2. Install node [here](https://nodejs.org/en/download/)

# Get Started
1. Clone project
2. Open root of project and run `yarn install` or `npm local`
3. Once installation is complete, run `./startApp.sh`
4. Open up port `http://localhost:8000/`

![image](https://user-images.githubusercontent.com/11052295/134073342-9ee46775-0fea-4b48-864f-6e492d1e4fca.png)

# Industry Overview
Sogeti hires consultants (Assets) to offer to their Clients (Buyers). Sogeti then proposes SOW agreement terms & conditions to Clients who accepts / negotiates contract. (Need more details) 

- Q: What happens when a contract is breached? What are the current procedures implemented? 
- Q: Does Sogeti know their Assets are appreciating? 
- Q: How do Sales approach Clients? Are there better ways? 

# Industry Problem(s)
- Consultant could be lying about set of skills or providing inaccurate asset information 
- Clients could be stuck with a bad Consultant (Asset) 
- Ask yourself: Who’s measuring their skills, and can we regulate the Consultants (Assets)? 
- Clients could be problematic  

# How Blockchain Disrupts Industry
- Consultants (Assets) appreciate in value via Skills, Certifications, Promotions, etc. 
- Consultants (Assets) can be regulated & verified 
- Cryptographic, transparent smart contracts that houses the business logic
- Contractual duties control transaction logic 
- Services / Responsibilities must be met to fulfill contractual agreement 
- Consultants (Assets) could regulate the Client (Buyer) 
- Could be extended to Asset Subscribers or Renters 
- Clients could be attracted to certain Assets, so consultant requests could reflect that 
- Regulators could be represented as: 
- Counselors (Assets) reviewing their Counselees (Assets) ⇒ Peer Review System 
- Upper management / leads (Assets) reviewing the Consultants (Assets) ⇒ Governed Review System 
- Regulating the Consultants (Assets) could allow for merit / demerit systems 
- IBP Points could be given 
- Confidential contracts could allow Sogeti to control different pricing agreements with different clients 

# Peer Overview
![image](https://user-images.githubusercontent.com/11052295/134073918-900bf28c-bce2-4991-9ea7-dd2772368b26.png)

# Defining Actors
![image](https://user-images.githubusercontent.com/11052295/134073940-63547b38-4f0e-4671-9dfb-fb0c397bb99d.png)

# Defining Chaincodes
- Price Agreement with Sogeti (Supplier) and Client (Buyer) 
- Transfer of Assets 

# Key Components and Transaction Logic 

![image](https://user-images.githubusercontent.com/11052295/134074162-1b2cb614-4063-4b32-9895-7eefc98c6ffa.png)

![image](https://user-images.githubusercontent.com/11052295/134074183-ab44c8f4-a639-4130-ac5b-b5a32a4f13bc.png)

![image](https://user-images.githubusercontent.com/11052295/134074257-2ec72c58-9f31-4d7a-97d0-afe0cd61aa21.png)



