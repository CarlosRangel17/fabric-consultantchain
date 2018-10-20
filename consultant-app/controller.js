//SPDX-License-Identifier: Apache-2.0

/*
  This code is based on code written by the Hyperledger Fabric community.
  Original code can be found here: https://github.com/hyperledger/fabric-samples/blob/release/fabcar/query.js
  and https://github.com/hyperledger/fabric-samples/blob/release/fabcar/invoke.js
 */

// call the packages we need
var express       = require('express');        // call express
var app           = express();                 // define our app using express
var bodyParser    = require('body-parser');
var http          = require('http')
var fs            = require('fs');
var Fabric_Client = require('fabric-client');
var path          = require('path');
var util          = require('util');
var os            = require('os');

module.exports = (function() {

	// Global Mapping Function Variable 
	var runFunction = function(record){

		var argList = [];
		Object.keys(record).forEach(function(key, index) {
			if (record.hasOwnProperty(key)){
				var value = (IsNullOrWhiteSpace(record[key]) ? '' : record[key]);
				argList.push(value);
			}
			else {
				argList.push('');
			}
		});

		return argList;
	}

	function GetRecordMapModel(record, chaincodeId, chaincodeFunction, channelId){
			
		var model = {
			Record: record,
			ChaincodeId: chaincodeId,
			ChaincodeFunction: chaincodeFunction,
			ChannelId: channelId
		}		

		console.log('Map Model: ', model);
		return model;
	}

	function IsNullOrWhiteSpace(instance){
		if (instance !== null && instance !== undefined && instance !== ''){
			return false;
		}		
		else{
			return true;
		}
	}

	function SetupFabricNetwork(model)
	{
		var fabric_client = new Fabric_Client();

		// ******* setup the fabric network *******  
        // add channel
        var channel = fabric_client.newChannel('mychannel');
        // add Peer 
        var peer = fabric_client.newPeer('grpc://localhost:7051');
        channel.addPeer(peer);
        // add Orderer 
		var order = fabric_client.newOrderer('grpc://localhost:7050')
		channel.addOrderer(order);

		var member_user = null;
		var store_path = path.join(os.homedir(), '.hfc-key-store');
		console.log('Store path:'+store_path);
		var tx_id = null;
		// ******* end setup *******  

		// custom fabric network model
		var fabricNetwork = {
			Channel: channel,
			Client: fabric_client,
			MemberUser: member_user,
			StorePath: store_path,
			TrxId: tx_id
		};

		// check if chaincode information was passed 
		if (!IsNullOrWhiteSpace(model)){
			fabricNetwork['ChaincodeId'] = model.ChaincodeId; //TODO: Verify this works
			fabricNetwork['ChannelId'] = model.ChannelId;
			fabricNetwork['ChaincodeFunction'] = model.ChaincodeFunction;
		}

		return fabricNetwork;
	};


	// Sets up Blockchain Network & Performs Read Query 
	function ReadBlockchain(model, res)
	{		
		var FabricNetwork = SetupFabricNetwork(model);

		// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
		Fabric_Client.newDefaultKeyValueStore({ path: FabricNetwork.StorePath
		}).then((state_store) => {
		    // assign the store to the fabric client
		    FabricNetwork.Client.setStateStore(state_store);
		    var crypto_suite = Fabric_Client.newCryptoSuite();
		    // use the same location for the state store (where the users' certificate are kept)
		    // and the crypto store (where the users' keys are kept)
		    var crypto_store = Fabric_Client.newCryptoKeyStore({path: FabricNetwork.StorePath});
		    crypto_suite.setCryptoKeyStore(crypto_store);
		    FabricNetwork.Client.setCryptoSuite(crypto_suite);

		    // get the enrolled user from persistence, this user will sign all requests
		    return FabricNetwork.Client.getUserContext('user1', true);
		}).then((user_from_store) => {

            // Check if user is enrolled 
		    if (user_from_store && user_from_store.isEnrolled()) {
		        console.log('Successfully loaded user1 from persistence');
		        FabricNetwork.MemberUser = user_from_store;
		    } else {
		        throw new Error('Failed to get user1.... run registerUser.js');
			}
			
			var key = model && model.Record && model.Record.Key ? model.Record.Key : '';
			
			const request = {
		        chaincodeId: FabricNetwork.ChaincodeId, 
		        txId: FabricNetwork.TrxId,
		        fcn: FabricNetwork.ChaincodeFunction,
		        args: [key]
			};

			console.log('request: ', request);

		    // send the query proposal to the peer
		    return FabricNetwork.Channel.queryByChaincode(request);
		}).then((query_responses) => {
		    console.log("Query has completed, checking results");
		    // query_responses could have more than one results if there multiple peers were used as targets
		    if (query_responses && query_responses.length == 1) {
		        if (query_responses[0] instanceof Error) {
		            console.error("error from query = ", query_responses[0]);
		        } else {
					console.log("Response is ", query_responses[0].toString());
		            res.json(JSON.parse(query_responses[0].toString()));
		        }
		    } else {
		        console.log("No payloads were returned from query");
		    }
		}).catch((err) => {
		    console.error('Failed to query successfully :: ' + err);
		});
	}

	// Sets up Blockchain Network & Performs Write Query 
	function WriteToBlockchain(model, res) 
	{		
		var FabricNetwork = SetupFabricNetwork(model);

		// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
		Fabric_Client.newDefaultKeyValueStore({ path: FabricNetwork.StorePath
		}).then((state_store) => {
		    // assign the store to the fabric client
		    FabricNetwork.Client.setStateStore(state_store);
		    var crypto_suite = Fabric_Client.newCryptoSuite();
		    // use the same location for the state store (where the users' certificate are kept)
		    // and the crypto store (where the users' keys are kept)
		    var crypto_store = Fabric_Client.newCryptoKeyStore({path: FabricNetwork.StorePath});
		    crypto_suite.setCryptoKeyStore(crypto_store);
		    FabricNetwork.Client.setCryptoSuite(crypto_suite);

		    // get the enrolled user from persistence, this user will sign all requests
		    return FabricNetwork.Client.getUserContext('user1', true);
		}).then((user_from_store) => {
		    if (user_from_store && user_from_store.isEnrolled()) {
		        console.log('Successfully loaded user1 from persistence');
		        FabricNetwork.MemberUser = user_from_store;
		    } else {
		        throw new Error('Failed to get user1.... run registerUser.js');
		    }

		    // get a transaction id object based on the current user assigned to fabric client
		    FabricNetwork.TrxId = FabricNetwork.Client.newTransactionID();
		    console.log("Assigning transaction_id: ", FabricNetwork.TrxId._transaction_id);            

			var argList = runFunction(model.Record);

            // recordConsultant - requires 
            // send proposal to endorser
		    const request = {
		        //targets : --- letting this default to the peers assigned to the channel
		        chaincodeId: FabricNetwork.ChaincodeId, 
		        fcn: FabricNetwork.ChaincodeFunction,
		        args: argList, 
		        chainId: FabricNetwork.ChannelId, 
		        txId: FabricNetwork.TrxId
			};

			// const request = ConfigureRequest(ChaincodeId, ChaincodeFun, ArgList, ChannelId, TrxId);
			
			// Param(s): ChaincodeId, Fun,  ArgList, ChainId (Channel Name), TransactionId 
			console.log('***************************************************');			
			console.log('Request = ', request)
			console.log('***************************************************');
			
			// send the transaction proposal to the peers
		    return FabricNetwork.Channel.sendTransactionProposal(request);
		}).then((results) => {
		    var proposalResponses = results[0];
		    var proposal = results[1];
		    let isProposalGood = false;
		    if (proposalResponses && proposalResponses[0].response &&
		        proposalResponses[0].response.status === 200) {
		            isProposalGood = true;
		            console.log('Transaction proposal was good');
		        } else {
		            console.error('Transaction proposal was bad');
		        }
		    if (isProposalGood) {
		        console.log(util.format(
		            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s"',
		            proposalResponses[0].response.status, proposalResponses[0].response.message));
					
		        // build up the request for the orderer to have the transaction committed
		        var request = {
		            proposalResponses: proposalResponses,
		            proposal: proposal
		        };

				console.log("***********************************************************************************");
				console.log('Proposal Request = ', request);
				console.log("***********************************************************************************");

				// set the transaction listener and set a timeout of 30 sec
		        // if the transaction did not get committed within the timeout period,
		        // report a TIMEOUT status
		        var transaction_id_string = FabricNetwork.TrxId.getTransactionID(); //Get the transaction ID string to be used by the event processing
		        var promises = [];

		        var sendPromise = FabricNetwork.Channel.sendTransaction(request);
		        promises.push(sendPromise); //we want the send transaction first, so that we know where to check status


				console.log('*****************************************************************')
				console.log('Send Promise = ', sendPromise)
				console.log('*****************************************************************')

		        // get an eventhub once the fabric client has a user assigned. The user
		        // is required bacause the event registration must be signed
		        let event_hub = FabricNetwork.Client.newEventHub();
		        event_hub.setPeerAddr('grpc://localhost:7053');

		        // using resolve the promise so that result status may be processed
		        // under the then clause rather than having the catch clause process
		        // the status
		        let txPromise = new Promise((resolve, reject) => {
		            let handle = setTimeout(() => {
		                event_hub.disconnect();
		                resolve({event_status : 'TIMEOUT'}); //we could use reject(new Error('Trnasaction did not complete within 30 seconds'));
		            }, 3000);
		            event_hub.connect();
		            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
		                // this is the callback for transaction event status
		                // first some clean up of event listener
		                clearTimeout(handle);
		                event_hub.unregisterTxEvent(transaction_id_string);
		                event_hub.disconnect();

		                // now let the application know what happened
		                var return_status = {
							event_status: code, 
							tx_id: transaction_id_string
						};
						
		                if (code !== 'VALID') {
		                    console.error('The transaction was invalid, code = ' + code);
		                    resolve(return_status); // we could use reject(new Error('Problem with the tranaction, event status ::'+code));
		                } else {
		                    console.log('The transaction has been committed on peer ' + event_hub._ep._endpoint.addr);
		                    resolve(return_status);
		                }
		            }, (err) => {
		                //this is the callback if something goes wrong with the event registration or processing
		                resolve(new Error('There was a problem with the eventhub ::'+err)); //TODO: replace resolve with reject 
		            });
		        });
		        promises.push(txPromise);

		        return Promise.all(promises);
		    } else {
		        console.error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
		        throw new Error('Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...');
		    }
		}).then((results) => {
		    console.log('Send transaction promise and event listener promise have completed');
		    // check the results in the order the promises were added to the promise all list
		    if (results && results[0] && results[0].status === 'SUCCESS') {
		        console.log('Successfully sent transaction to the orderer.');
		        res.send(FabricNetwork.TrxId.getTransactionID());
		    } else {
		        console.error('Failed to order the transaction. Error code: ' + response.status);
		    }

		    if(results && results[1] && results[1].event_status === 'VALID') {
		        console.log('Successfully committed the change to the ledger by the peer');
		        res.send(FabricNetwork.TrxId.getTransactionID());
		    } else {
		        console.log('Transaction failed to be committed to the ledger due to ::'+results[1].event_status);
		    }
		}).catch((err) => {
		    console.error('Failed to invoke successfully :: ' + err);
		});
	}

	function callLog(message){
		console.log("************************************** ");
		console.log(message);
		console.log("************************************** ");
	}

return{
	
	get_all_consultants: function(req, res){

		callLog("Enter controller.js: get_all_consultants \n - Getting all consultants from database:");

		var consultant = {
			Key: '' // For now we pass a blank string to query all consultants,
		};

		var model = GetRecordMapModel(consultant, 'consultant-app', 'queryAllConsultants', 'myChannel');

		ReadBlockchain(model, res);
	},
	get_all_sows: function(req, res) {
		callLog("Enter controller.js: get_all_sows \n - Getting all sogeti sows from database:");

		var consultant = {
			Key: '' // For now we pass a blank string to query all sows,
		};

		var model = GetRecordMapModel(consultant, 'consultant-app', 'queryAllSows', 'myChannel');

		ReadBlockchain(model, res);
	},
	add_consultant: function(req, res){

		callLog("Enter controller.js: add_consultant \n - Submit recording of a consultant addition: ");

		// Retrieve consultant params 
		var record =  JSON.parse(req.query.consultant);

		// *************************************************************
		// 					DO NOT MODIFY 
		// >>>> The ternary operator is purposefully written. 
		// >>>> The properties of our models in the Blockchain  
		// >>>> require at least a blank value for now.		
		// *************************************************************
		// Chaincode Method: recordConsultant 
		// Chaincode Arg(s): requires 8 args: ID, Date Created, First Name, Last name, RatePerHour, Title, Skill Type, Skill Level
		// Chaincode Example: args: ['10', '2018-04-24', 'Carlos', 'Rangel', 'carlos.jpeg', 'Consultant', '80', 'Blockchain', '3', 'Hyperledger', '', '', '1'], 
        var consultant = {
            Id: record.Id == undefined ? '' : record.Id,
            DateCreated: record.DateCreated == undefined ? '' : record.DateCreated,
            FirstName: record.FirstName == undefined ? '' : record.FirstName,
            LastName: record.LastName == undefined ? '' : record.LastName,
            AvatarImage: record.AvatarImage == undefined ? '' : record.AvatarImage,
            Title: record.Title == undefined ? '' : record.Title,
            RatePerHour: record.RatePerHour == undefined ? '' : record.RatePerHour,
            SkillType: record.SkillType == undefined ? '' : record.SkillType,
            SkillLevel: record.SkillLevel == undefined ? '' : record.SkillLevel,
            Skill1: record.Skill1 == undefined ? '' : record.Skill1,
            Skill2: record.Skill2 == undefined ? '' : record.Skill2,
            Skill3: record.Skill3 == undefined ? '' : record.Skill3,
            ClientId: record.ClientId == undefined ? '' : record.ClientId
		};

		// Retrieve Blockchain Parameter Mapping Model
		// param(s): record, chaincodeId, chaincodeFunction, channelId
		var model = GetRecordMapModel(consultant, 'consultant-app', 'recordConsultant', 'mychannel');

		console.log('model: ');
		console.log(model);
		console.log('end model');

		WriteToBlockchain(model, res);
	},
	get_consultant: function(req, res) {

		callLog("Enter controller.js: get_consultant");

		var key = req.params.id;
		console.log("Getting consultant by key: " + key);

		var consultant = {
			Key: key
		};

		var model = GetRecordMapModel(consultant, 'consultant-app', 'queryConsultant', 'myChannel');

		ReadBlockchain(model, res);
	},
	request_consultant: function(req, res){

		// Retrieve consultant params 
		callLog("Enter controller.js: request_consultant \n - Submit client request for a consultant asset: ");

		// Retrieve SOW params 
		var record =  JSON.parse(req.query.consultant);

		// *************************************************************
		// 					DO NOT MODIFY 
		// 		NOTE: The ternary operator is purposefully written. 
		// 			  The Properties of our models in the Blockchain  
		//			  will require at least a blank value for now.
		// *************************************************************
		// Chaincode Method: requestConsultant 
		// Chaincode Arg(s): requires 8 args: ID, Date Created, First Name, Last name, RatePerHour, Title, Skill Type, Skill Level
		// Chaincode Example: args: ['10', '2018-04-24', 'Carlos', 'Rangel', 'carlos.jpeg', 'Consultant', '80', 'Blockchain', '3', 'Hyperledger', '', '', '1'], 
        var sowRequest = {
            Id: record.Id == undefined ? '' : record.Id,
            DateCreated: record.DateCreated == undefined ? '' : record.DateCreated,
			TermStartDate: record.TermStartDate == undefined  ? '' : record.TermStartDate,
            TermEndDate: record.TermEndDate == undefined ? '' : record.TermEndDate,
            RequireFullTime: record.RequireFullTime == undefined ? '' : record.RequireFullTime,
            RatePerHour: record.RatePerHour == undefined ? '' : record.RatePerHour,
            Status: record.Status == undefined ? '' : record.Status,
			ClientId: record.ClientId == undefined ? '' : record.ClientId,
			Name: record.Name == undefined ? '' : record.Name,
            ConsultantId: record.ConsultantId == undefined ? '' : record.ConsultantId,
            SOWId: record.SOWId == undefined ? '' : record.SOWId,
            Description: record.Description == undefined ? '' : record.Description,
            Requirement1: record.Requirement1 == undefined ? '' : record.Requirement1,
            Requirement2: record.Requirement2 == undefined  ? '' : record.Requirement2,
            Requirement3: record.Requirement3 == undefined  ? '' : record.Requirement3
        };

		// Retrieve Blockchain Parameter Mapping Model
		// param(s): mapRecord, chaincodeId, chaincodeFunction, channelId
		var model = GetRecordMapModel(sowRequest, 'consultant-app', 'requestConsultant', 'mychannel');
		console.log(model);

		WriteToBlockchain(model, res);
	}
}
})();