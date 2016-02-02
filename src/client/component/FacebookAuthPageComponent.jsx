var React = require('react');
var Auth = require('../Auth');

var FacebookAuthPageComponent = React.createClass({
    onSignIn : function() {
        var self = this;
        Auth.authFacebook(function(success) {
            if (success) {
                self.props.onSuccess();   
            }
        });
    },
    
    render : function() {
        return (
            <div className='indentSides'>
                <img
                    className='fbLogo' 
                    onClick={this.onSignIn}
                    src="img/sign-in-facebook.png"
                />
            </div>
        )
	}
});

module.exports = FacebookAuthPageComponent;