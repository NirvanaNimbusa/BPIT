// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

});

// Functions =============================================================
const client = new chain.Client();

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';
    // jQuery AJAX call for JSON
    $.getJSON( '/users/accountList', function( data ) {
        userListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.firstName + '">' + this.firstName + '</a></td>';
            tableContent += '<td>' + this.lastName + '</td>';
            tableContent += '<td>' + this.Stock1 + '</td>';
            tableContent += '<td>' + this.quantity1 + '</td>';
            tableContent += '<td>' + this.Stock2 + '</td>';
            tableContent += '<td>' + this.quantity2 + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#accountList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.firstName; }).indexOf(thisUserName);

    // Get our User Object
    var thisUserObject = userListData[arrayPosition];

    //Populate Info Box
    $('#firstName').text(thisUserObject.firstName);
    $('#lastName').text(thisUserObject.lastName);
    $('#Stock1').text(thisUserObject.Stock1);
    $('#Stock2').text(thisUserObject.Stock2);

};

function addAccount(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addAccount input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'firstName': $('#addAccount fieldset input#firstName').val(),
            'lastName': $('#addAccount fieldset input#lastName').val(),
            'Stock1': $('#addAccount fieldset input#Stock1').val(),
            'quantity1': $('#addAccount fieldset input#quantity1').val(),
            'Stock2': $('#addAccount fieldset input#Stock2').val(),
            'quantity2': $('#addAccount fieldset input#quantity2').val()
        }

        //_______________________CHAIN CODE______________________________

        let _signer

        Promise.resolve().then(() => {
          // snippet create-key
          const keyPromise = client.mockHsm.keys.create()
          // endsnippet

          return keyPromise
        }).then(key => {
          // snippet signer-add-key
          const signer = new chain.HsmSigner()
          signer.addKey(key.xpub, client.mockHsm.signerConnection)
          // endsnippet

          _signer = signer
          return key
        }).then(key => {
          // snippet create-asset
          const goldPromise = client.assets.create({
            alias: this.Stock1,
            rootXpubs: [key.xpub],
            quorum: 1
          })
          // endsnippet

          // snippet create-account-alice
          const alicePromise = client.accounts.create({
            alias: this.firstName,
            rootXpubs: [key.xpub],
            quorum: 1
          })
            return Promise.all([goldPromise, alicePromise])
        }).catch(err => 
            process.nextTick(() => {throw err })
        )
          // endsnippet

        //________________________________________________________________

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/addAccount',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {
                // Clear the form inputs
                $('#addAccount fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};
// Username link click
$('#accountList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
$('#btnAddAccount').on('click', addAccount);
 $('#accountList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
