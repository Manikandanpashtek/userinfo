console.log("hello world");
define(["postmonger"], function (Postmonger) {
    "use strict";
    var connection = new Postmonger.Session();

  let activityKey;
  let authToken;
  let restEndpoint;
  

  let subjectData;
  let sourceDataList = [];
    $(window).ready(onRender);
    connection.on("initActivity", initialize);
    connection.on("requestedTokens",onGetTokens);
    connection.on("requestedEndpoints", onGetEndpoints);
     
    function onRender(){
        connection.trigger("ready");
        connection.trigger("requestTokens");
        connection.trigger("requestEndpoints");
    }

    function initialize(data) {
        $('#step1').hide();
        $('#step2').show();
        console.log('initilize called::'+data.key+"\n"+JSON.stringify(data));
        activityKey = data.key;
      
    }
  
    function onGetTokens(tokens) {
        console.log('onGetTokens func called::'+ tokens.fuel2token);
        authToken =  tokens.fuel2token;
        // if(emailsubject){
            getSubjectData();
        // }else{
        //     console.log("no subject found for this activity");
        // }
    }

    function onGetEndpoints(endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        restEndpoint = endpoints.fuelapiRestHost;
        console.log(restEndpoint);
      }
    
    function getSubjectData(){
        console.log('getsubjectdata::auth:'+authToken+',endpoint:'+restEndpoint);
        fetch(
            `/subject/data?token=${authToken}&endpoint=${restEndpoint}`,
            {
                method:"GET",
            }
        )
        .then((response) => { 
            console.log('getSubjectData::json the response')
            return response.json()
          })
          .then((dataValue) => {
            console.log('getSubjectData::json::'+JSON.stringify(dataValue));
            console.log("userName=",dataValue.userName);
            subjectData = dataValue.subject;
    //         if (subjectData) {
    //           console.log('calling getOriginalData. acct_id:' +dataValue.acc_id);
    //           getOriginalData(dataValue.acc_id);
    //         } else {
    //           console.log('calling findDifferences.');
    //           sourceDataList = [];
    //           findDifferences();
    //         }
          })
          .catch((error) => {
            sourceDataList = [];
            console.log("api subject runningHover : ", error);
          });
      }
//     function getOriginalData(sparkpostUserId) {
//         //console.log('getOriginalData subjectData '+subjectData);
//         //console.log('authToken '+authToken);
//         let cam_Idenfier = subjectData.campaignIdentifier;
    
//         fetch(`/source/data?acc_id=${sparkpostUserId}&header_val=${cam_Idenfier}`, {
//           method: "GET",
//         })
//           .then((response) => response.json())
//           .then((dataValue) => {
//             sourceDataList = dataValue.length == 0 ? [] : dataValue;
//             getDomainRows();
//           })
//           .catch((error) => {
//             sourceDataList = [];
//             console.log("api source runningHover : ", error);
//           });
//       }
});