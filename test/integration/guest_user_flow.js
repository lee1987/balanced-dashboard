module('Guest', {
    setup: function () {
        Ember.run(function () {
            Balanced.Auth.setAuthProperties(false, null, null, null, false);
        });
    }, teardown: function () {

    }
});

test('visiting start creates a marketplace', function (assert) {
    Ember.run(function () {
        Balanced.Router.create().transitionTo('start');
    });
    assert.ok(window.location.hash.indexOf('start'), 'Transitioned to the start page');
    assert.equal(Balanced.Auth.get('userId'), '/users/guest', 'Userid is guest');
    assert.equal(Balanced.Auth.get('signedIn'), true, 'User is signed in');
    assert.ok(Balanced.Auth.get('isGuest'));
    assert.ok(Balanced.NET.ajaxHeaders['Authorization'], 'Authorization header set');
});

test('visiting start and then settings, can view api secret key', function(assert) {
    ////
    // In order to get this working, we need to be able to issue POSTS and persistent the creates in tests.
    ////

    // Ember.run(function() {
    //     Balanced.Router.create().transitionTo('start');
    // });

    // var api_secret_key = $(".api-key .secret").text();

    // $(".dashboard").click();

    // $("li.settings a").click();

    // $(".control-group .controls .api-key-secret a").click();

    // var shown_api_secret_key = $(".control-group .controls .api-key-secret").text();

    // assert.equal(api_secret_key, shown_api_secret_key, 'Generated api secret matches shown api secret in settings');
});

test('claim account creates a login', function (assert) {
    expect(4);

    var emailAddress = 'marshall@example.com',
        password = 'SupahSecret123~!';

    Ember.run(function () {
        Balanced.Router.create().transitionTo('start');
    });
    Ember.run(function () {
        Balanced.Router.create().transitionTo('claim');
    });

    assert.notEqual($('h1').text().trim().indexOf('Claim your account'), -1, 'title is incorrect');
    assert.equal($('[name="email_address"]').length, 1, 'email address is visible');

    $('[name="email_address"]').val(emailAddress).keyup();
    $('[name="password"]').val(password).keyup();
    $('[name="passwordConfirm"]').val(password).keyup();
    $('button', '#claim-form').click();

    var expectedCalls = [
        {
            type: Balanced.Claim,
            data: {
                email_address: emailAddress,
                password: password
            }
        },
        {
            type: Balanced.Login,
            data: {
                email_address: emailAddress,
                password: password
            }
        }
    ];

    _.each(expectedCalls, function (e) {
        var match = 0;
        _.each(Balanced.Adapter.creates, function (create) {
            if (e.type !== create.type) {
                return;
            }
            _.each(e.data, function (d) {
                if (create.data[d] !== e.data[d]) {
                    match = false;
                    return;
                }
            });
            match = true;
        });
        assert.ok(match);
    });
});
