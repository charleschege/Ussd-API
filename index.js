const express = require("express");
const router = express.Router();
const underscore = require("underscore.string");

router.post("/", (req, res) => {
    var { sessionId, serviceCode, phoneNumber, text } = req.body;
    var text = text.trim();

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



        if (arrayText[2] === "") {
            response = `CON Enter The Loan Amount`;
        } else if (arrayText[3] === undefined) {
            response = `CON Enter Phone No To Guarantee Loan`;
        } else if (arrayText[4] === undefined) {
            response = `CON Enter Amount for ${arrayText[3]} to Guarantee`;
        } else if (arrayText[5] === undefined) {
            response = `CON Review and Confirm Details
                        Loan: ${arrayText[2]}
                   Guarantor: ${arrayText[3]}
            Guarantee Amount: ${arrayText[4]}

            1. Confirm Details
            2. Cancel
            `;
        } else if (arrayText[5] === "1") {
            response = `END Your loan is now being processed`;
        } else if (arrayText[5] === "2") {
            response = `END You have successfully cancelled the loan request`;
        } else {
            response = `CON Choose A Preferred Option
            1. Clean Shelf
            2. Table Banking
            3. Guarantee`;
        }
    }
    else if (text === "1*2" || text === "2*2") {
        response = `CON Enter Amount of loan to repay`;
    } else if (text.includes("1*2*") || text.includes("2*2*")) {
        let arrayText = split(text);


        if (arrayText[2] === undefined) {
            response = `CON Enter Amount of loan to repay`;
        } else if (arrayText[3] === undefined) {
            response = `CON Enter Secret PIN`;
        } else if (arrayText[4] === undefined) {
            response = `CON Confirm Repayment of ${arrayText[2]}
            1. Confirm Repayment
            2. Cancel Repayment
            `;
        } else if (arrayText[4] === "1") {
            response = `END Loan Repayment of ${arrayText[2]} is being processed
            `;
        } else if (arrayText[4] === "2") {
            response = `END Loan Repayment of ${arrayText[2]} is has been cancelled
            `;
        } else {
            response = `CON Choose an option from those provided
            1. Confirm Repayment
            2. Cancel Repayment
            `;
        }
    } else if (text === "1*3" || text === "2*3") {
        response = `END Your loan limit is being processed. You will receive an SMS shortly.`;
    } else if (text === "1*4" || text === "2*4") {
        response = `END Your balance is being processed. You will receive an SMS shortly.`;
    } else if (text === "3") {
        // FIXME remove this and call from your database
        response = `CON ${load_memdb()}`;
    } else if (text.includes("3*")) {
        let arrayText = split(text);
        console.log(arrayText);

        if (arrayText[2] !== undefined) {
            let target = parseInt(arrayText[1]) - 1;
            let userData = [...memdb][target];

            if (parseInt(arrayText[2]) > userData[1]) {
                response = `CON You cannot guarantee KES ${arrayText[2]} that is higher than the requested amount of ${userData[1]}.`
            } else {
                response = `END Your guarantee amount of KES ${arrayText[2]} from a request of KES ${userData[1]} by ${userData[0]} is being processed. You will receive a confirmation shortly.`;

            }
        } else if (arrayText[1] === "3") {
            response = `END Cancelled request.`;
        }
        // FIXME Make this part fetch from the database
        else if (arrayText[1] === "1" || arrayText[1] > "1") {
            let target = parseInt(arrayText[1]) - 1;
            let userData = [...memdb][target];

            if (userData === undefined) {
                response = `CON Choose only from available requests. \n ${load_memdb()}`;
            } else {
                response = `CON Amount to Guarantee the loan of ${userData[1]}`;
            }

        } else {
            response = `END Choose only provided options to guarantee a loan`;
        }
    } else {
        response = `END Unable to get your input. Try again later`;
    }

    res.set("Content-Type: text/plain");
    res.send(response);
});

function split(inputText) {
    let result = underscore.words(inputText, /\*/);

    return result;
}

function load_memdb() {
    return `Choose which phone number to guarantee loan
        1. KES ${[...memdb][0][1]} for Account ${[...memdb][0][0]}
        2. KES ${[...memdb][1][1]} for Account ${[...memdb][1][0]}
        3. Cancel
        `
}


var memdb = new Map();
memdb.set("0700000001", 5000);
memdb.set("0700000002", 200);


module.exports = router;
