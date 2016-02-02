var React = require('react');

var GreenFridgeIconComponent = React.createClass({
    render : function() {
        return (
        	<img
	        	style = {{
	        		maxHeight : '40px',
	        	}}
	        	src = "img/logo.icon.png"
        	/>
        )
	}
});

module.exports = GreenFridgeIconComponent;