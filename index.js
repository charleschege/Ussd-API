const express = require("express");
const router = express.Router();
const underscore = require("underscore.string");

const accountData = new Map();

router.post("/", (req, res) => {
    var { sessionId, serviceCode, phoneNumber, text } = req.body;

    var text = text.trim();

    console.log("---- BEGIN ----");
    console.log(text);
    console.log(sessionId);
    console.log(serviceCode);
    console.log(phoneNumber);

    accountData.set(phoneNumber, {
        sessionId: sessionId,
        serviceCode: serviceCode,
        text: text,
        loanAmount: "",
        guarantorPhoneNo: "",
        guarantorAmount: "",
        confirmed: false,
    });

    console.log(accountData);

    let response = "";

    if (text === "") {
        // This is the first request. Note how we start the response with CON
        response = `CON Choose A Preferred Option
        1. Clean Shelf
        2. Table Banking
        3. Guarantee`;
    } else if (text === "1" || text === "2") {
        response = `CON Choose Your Preference
        1. Take A Loan
        2. Repay A Loan
        3. Check Limit
        4. View Balance`;
    } else if (text === "1*1" || text === "2*1") {
        response = `CON Choose Your Preference
        1. Enter Amount of loan to take`;
    } else if (text.includes("1*1*") || text.includes("2*1*")) {
        let arrayText = split(text);

        console.log(`Array Text ${arrayText}`);

        if (accountData.get(phoneNumber).loanAmount === "" && arrayText[2] === "") {
            response = `CON Enter The Loan Amount`;
        } else if (accountData.get(phoneNumber).loanAmount === "" && arrayText[2] !== "") {
            accountData.set(phoneNumber).loanAmount = arrayText[2];

            response = `CON Enter Phone No To Guarantee Loan`;
        } else if (accountData.get(phoneNumber).guarantorPhoneNo === "" && arrayText[3] === "") {
            response = `CON Enter Phone No To Guarantee Loan`;
        } else if (accountData.get(phoneNumber).guarantorPhoneNo === "" && arrayText[3] !== "") {
            accountData.set(phoneNumber).guarantorPhoneNo = arrayText[3];

            response = `CON Enter Amount for ${arrayText[3]} to Guarantee`;
        } else if (accountData.get(phoneNumber).guarantorAmount === "" && arrayText[4] === "") {
            response = `CON Enter Amount for ${arrayText[3]} to Guarantee`;
        } else if (accountData.get(phoneNumber).guarantorAmount === "" && arrayText[4] !== "") {
            accountData.set(phoneNumber).guarantorAmount = arrayText[4];

            let currentState = accountData.get(phoneNumber);
            response = `CON Review and Confirm Details
                       Loan: ${currentState.loanAmount}
                  Guarantor: ${currentState.guarantorPhoneNo}
            Guarantee Amout: ${currentState.guarantorAmount}

            1. Confirm Details
            2. Cancel
            `;
        } else if (
            accountData.get(phoneNumber).loanAmount !== ""
            && accountData.get(phoneNumber).guarantorPhoneNo !== ""
            && accountData.get(phoneNumber).guarantorPhoneNo !== ""
            && accountData.get(phoneNumber).guarantorAmount !== ""
            && arrayText[5] === ""
        ) {
            let currentState = accountData.get(phoneNumber);
            response = `CON Review and Confirm Details
                       Loan: ${currentState.loanAmount}
                  Guarantor: ${currentState.guarantorPhoneNo}
            Guarantee Amout: ${currentState.guarantorAmount}

            1. Confirm Details
            2. Cancel
            `;
        } else if (
            accountData.get(phoneNumber).loanAmount !== ""
            && accountData.get(phoneNumber).guarantorPhoneNo !== ""
            && accountData.get(phoneNumber).guarantorPhoneNo !== ""
            && accountData.get(phoneNumber).guarantorAmount !== ""
            && arrayText[5] !== ""
        ) {
            if (arrayText[5] === "1") {
                accountData.get(phoneNumber).confirmed = true;
                response = `END Loan Status Confirmed`;
            } else {
                accountData.delete(phoneNumber);

                response = `END Loan Processes Has Been Reset`;
            }
        }
    } else {
        response = `END Unable to get your input. Try again later`;
    }

    // Print the response onto the page so that our SDK can read it
    res.set("Content-Type: text/plain");
    res.send(response);

    console.log(response);

    console.log("----------- END ----------------");

    // DONE!!!
});

function split(inputText) {
    let result = underscore.words(inputText, /\*/);

    return result;
}

module.exports = router;
