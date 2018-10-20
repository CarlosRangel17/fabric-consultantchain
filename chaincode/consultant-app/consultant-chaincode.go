//SPDX-License-Identifier: Apache-2.0

// Import dependencies
// Import the chaincode shim package and the peer protobuf package

/*  This code is based on code written by the Hyperledger Fabric community.
Original code can be found here: https://github.com/hyperledger/fabric-samples/blob/release/chaincode/chaincode_example02/chaincode_example02.go
*/

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric/common/util"
	// "github.com/projects/fabric-consultantchain/domains"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// SmartContract implements a simple chaincode to manage an asset
type SmartContract struct {
}

type Consultant struct {
	DateCreated string `json:"DateCreated"`
	FirstName   string `json:"FirstName"`
	LastName    string `json:"LastName"`
	AvatarImage string `json:"AvatarImage"`
	Title       string `json:"Title"`
	RatePerHour string `json:"RatePerHour"`
	SkillType   string `json:"SkillType"`
	SkillLevel  string `json:"SkillLevel"`
	Skill1      string `json:"Skill1"`
	Skill2      string `json:"Skill2"`
	Skill3      string `json:"Skill3"`
	ClientId    string `json:"ClientId"`
}

type SOW struct {
	DateCreated     string `json:"DateCreated"`
	TermStartDate   string `json:"TermStartDate"`
	TermEndDate     string `json:"TermEndDate"`
	RequireFullTime string `json:"RequireFullTime"`
	RatePerHour     string `json:"RatePerHour"`
	Status          string `json:"Status"`
	ClientId        string `json:"ClientId"`
	Name            string `json:"Name"`
	ConsultantId    string `json:"ConsultantId"`
	SOWId           string `json:"SOWId"`
	Description     string `json:"Description"`
	Requirement1    string `json:"Requirement1"`
	Requirement2    string `json:"Requirement2"`
	Requirement3    string `json:"Requirement3"`
}

func Seed() []Consultant {
	seedList := []Consultant{
		{DateCreated: "2017-04-24", FirstName: "Carlos", LastName: "Rangel", AvatarImage: "carlos.jpg", Title: "Consultant", RatePerHour: "20", SkillType: "Blockchain", SkillLevel: "3", Skill1: "Ethereum", Skill2: "", Skill3: "", ClientId: "1"},
		{DateCreated: "2017-05-07", FirstName: "Keyurkumar", LastName: "Patel", AvatarImage: "keyur.jpeg", Title: "Consultant", RatePerHour: "20", SkillType: "BI", SkillLevel: "3", Skill1: "PowerBI", Skill2: "", Skill3: "", ClientId: "1"},
		{DateCreated: "2017-05-07", FirstName: "Puneet", LastName: "Mittal", AvatarImage: "puneet.jpg", Title: "Senior Consultant", RatePerHour: "25", SkillType: "Cloud", SkillLevel: "3", Skill1: "Azure", Skill2: "", Skill3: "", ClientId: "1"},
		{DateCreated: "2015-09-24", FirstName: "Aval", LastName: "Pandya", AvatarImage: "aval.jpeg", Title: "Manager", RatePerHour: "30", SkillType: "BA", SkillLevel: "4", Skill1: "PowerBI", Skill2: "", Skill3: "", ClientId: ""},
		{DateCreated: "2015-01-20", FirstName: "Hines", LastName: "Vaughan", AvatarImage: "hines.jpeg", Title: "Senior Consultant", RatePerHour: "25", SkillType: "Mobile", SkillLevel: "4", Skill1: "Xamarin", Skill2: "", Skill3: "", ClientId: ""},
		{DateCreated: "2018-06-24", FirstName: "Brandon", LastName: "Timmons", AvatarImage: "timmons.jpeg", Title: "Associate Consultant", RatePerHour: "15", SkillType: "Web", SkillLevel: "2", Skill1: "ASP.NET MVC", Skill2: "", Skill3: "", ClientId: ""},
		{DateCreated: "2017-03-24", FirstName: "Peter", LastName: "Menh", AvatarImage: "peter.jpeg", Title: "Associate Consultant", RatePerHour: "15", SkillType: "Web", SkillLevel: "2", Skill1: "ASP.NET MVC", Skill2: "", Skill3: "", ClientId: ""},
		{DateCreated: "2014-06-01", FirstName: "Mark", LastName: "Salinas", AvatarImage: "mark.jpeg", Title: "Manager", RatePerHour: "30", SkillType: "Cloud", SkillLevel: "4", Skill1: "Azure", Skill2: "AWS", Skill3: "", ClientId: ""},
	}
	return seedList
}

func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()

	// Route to the appropriate handler function to interact with the ledger
	if function == "queryAllConsultants" {
		return s.queryAllConsultants(APIstub)
	} else if function == "queryConsultant" {
		return s.queryConsultant(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "recordConsultant" {
		return s.recordConsultant(APIstub, args)
	} else if function == "queryAllSow" {
		chainCodeArgs := util.ToChaincodeArgs("queryAllSow", "")
		response := APIstub.InvokeChaincode("sow-app", chainCodeArgs, "myChannel")

		if response.Status != shim.OK {
			return shim.Error(response.Message)
		}
		return shim.Success(nil)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

// get consultant by id
// - param(s): id string
func (s *SmartContract) queryConsultant(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	consultantAsBytes, _ := APIstub.GetState(args[0])
	if consultantAsBytes == nil {
		return shim.Error("Could not locate consultant")
	}

	return shim.Success(consultantAsBytes)
}

// initialize ledger with seed data
// - param(s):
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	consultants := Seed()

	i := 0
	for i < len(consultants) {
		fmt.Println("i is ", i)
		consultantsAsBytes, _ := json.Marshal(consultants[i])
		APIstub.PutState(strconv.Itoa(i+1), consultantsAsBytes)
		fmt.Println("Added", consultants[i])
		i = i + 1
	}

	return shim.Success(nil)
}

// add consultant entry
// - param(s): id string, dateCreated string, firstName string, lastName string, title string, skillLevel string, skillType string, skill1 string, skill2 string, skill3 string, clientId string
func (s *SmartContract) recordConsultant(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 13 {
		return shim.Error("Incorrect number of arguments. Expected 13")
	}

	var consultant = Consultant{
		DateCreated: args[1],
		FirstName:   args[2],
		LastName:    args[3],
		AvatarImage: args[4],
		Title:       args[5],
		RatePerHour: args[6],
		SkillType:   args[7],
		SkillLevel:  args[8],
		Skill1:      args[9],
		Skill2:      args[10],
		Skill3:      args[11],
		ClientId:    args[12],
	}

	consultantAsBytes, _ := json.Marshal(consultant)
	err := APIstub.PutState(args[0], consultantAsBytes)

	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record consultant: %s", args[0]))
	}

	return shim.Success(nil)
}

// get all consultants
// - param(s):
func (s *SmartContract) queryAllConsultants(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "0"
	endKey := "999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add comma before array members,suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllConsultants:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

// change consultant client
// - param(s): consultantId string, clientId string
func (s *SmartContract) changeConsultantHolder(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	consultantAsBytes, _ := APIstub.GetState(args[0])
	if consultantAsBytes == nil {
		return shim.Error("Could not locate consultant")
	}
	consultant := Consultant{}

	json.Unmarshal(consultantAsBytes, &consultant)
	//TODO: Normally check that the specified argument is a valid holder of tuna
	consultant.ClientId = args[1]

	consultantAsBytes, _ = json.Marshal(consultant)
	err := APIstub.PutState(args[0], consultantAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to change consultant client: %s", args[0]))
	}

	return shim.Success(nil)
}

// begin consultant (asset) request from client (buyer)
// - param(s):
func (s *SmartContract) requestConsultant(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 15 {
		return shim.Error("Incorrect number of arguments. Expecting 15")
	}

	var sow = SOW{
		DateCreated:     args[1],
		TermStartDate:   args[2],
		TermEndDate:     args[3],
		RequireFullTime: args[4],
		RatePerHour:     args[5],
		Status:          args[6],
		ClientId:        args[7],
		Name:            args[8],
		ConsultantId:    args[9],
		SOWId:           args[10], // Parent SOW
		Description:     args[11],
		Requirement1:    args[12],
		Requirement2:    args[13],
		Requirement3:    args[14],
	}

	sowAsBytes, _ := json.Marshal(sow)
	err := APIstub.PutState(args[0], sowAsBytes)

	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to request consultant: %s", args[0]))
	}

	return shim.Success(sowAsBytes)
}

// main function starts up the chaincode in the container during instantiate
func main() {
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Println("Could not start SmartContract")
	} else {
		fmt.Println("SmartContract successfully started")
	}
}
