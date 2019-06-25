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
	// "github.com/hyperledger/fabric/common/util"
	// "github.com/projects/fabric-consultantchain/domains"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// SmartContract implements a simple chaincode to manage an asset
type SmartContract struct {
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

func Seed() []SOW {
	seedList := []SOW{
		{DateCreated: "2014-06-01", TermStartDate: "2017-04-24", TermEndDate: "", RequireFullTime: "true", RatePerHour: "25", Status: "", ClientId: "1", Name: "Carlos Rangel", ConsultantId: "1", SOWId: "1", Description: "Web Application developer", Requirement1: "Requirement 1", Requirement2: "Requirement 2", Requirement3: "Requirement 3"},
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
	if function == "queryAllSOWs" {
		return s.queryAllSOWs(APIstub)
	} else if function == "querySOW" {
		return s.querySOW(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "recordSOW" {
		return s.recordSOW(APIstub, args)
	} else if function == "requestConsultant" {
		return s.requestConsultant(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

// get sow by id
// - param(s): id string
func (s *SmartContract) querySOW(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	sowAsBytes, _ := APIstub.GetState(args[0])
	if sowAsBytes == nil {
		return shim.Error("Could not locate sow")
	}

	return shim.Success(sowAsBytes)
}

// initialize ledger with seed data
// - param(s):
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	sows := Seed()

	i := 0
	for i < len(sows) {
		fmt.Println("i is ", i)
		sowAsBytes, _ := json.Marshal(sows[i])
		APIstub.PutState(strconv.Itoa(i+1), sowAsBytes)
		fmt.Println("Added", sows[i])
		i = i + 1
	}

	return shim.Success(nil)
}

// add sow entry
func (s *SmartContract) recordSOW(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 13 {
		return shim.Error("Incorrect number of arguments. Expected 14")
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
		SOWId:           args[10],
		Description:     args[11],
		Requirement1:    args[12],
		Requirement2:    args[13],
		Requirement3:    args[14],
	}

	sowAsBytes, _ := json.Marshal(sow)
	err := APIstub.PutState(args[0], sowAsBytes)

	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to record sow: %s", args[0]))
	}

	return shim.Success(nil)
}

// get all sows
// - param(s):
func (s *SmartContract) queryAllSOWs(APIstub shim.ChaincodeStubInterface) sc.Response {

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

	fmt.Printf("- queryAllSows:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

// begin sow (asset) request from client (buyer)
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
		SOWId:           args[10],
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
