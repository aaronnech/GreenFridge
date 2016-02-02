var React = require('react');
var Constants = require('../Constants');
var ReactFireMixin = require('reactfire');

var DatePicker = require('material-ui/lib/date-picker/date-picker');
var TextField = require('material-ui/lib/text-field');
var FloatingActionButton = require('material-ui/lib/floating-action-button');
var Delete = require('material-ui/lib/svg-icons/action/delete');
var SelectField = require('material-ui/lib/select-field');
var MenuItem = require('material-ui/lib/menus/menu-item');

var LabeledSliderComponent = require('./LabeledSliderComponent.jsx')

var floatBottomBtnStyle = {
    zIndex: 100,
    position: 'fixed',
    bottom: 10,
    right: 10,
};

var DeleteProductComponent = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState : function() {
        return {
            waste: 50,
            valid: false,
        };
    },

    componentWillMount : function() {
        var firebaseRef = new Firebase(Constants.fireAccess + 'products/' + this.props.productKey);
        this.bindAsObject(firebaseRef, 'product');
    },

    handleWasted : function(_, val) {
        console.log(val);
        if (!isNumeric(val)) return;

        this.setState({
            quantity : Math.round(Number(val)),
        });
    },

    onSubmit : function() {
        if (!this.validate()) return;

        var firebaseRef = new Firebase(Constants.fireAccess + 'old_products/');
        var prod = clone(this.state.product);
        delete prod['.key'];
        prod.waste = this.state.waste;
        firebaseRef.push(prod);

        firebaseRef = new Firebase(Constants.fireAccess + 'products/' + this.props.productKey);
        firebaseRef.remove();

        this.props.onSubmit();
    },

    validate : function() {
        return isNumeric(this.state.waste);
    },

    render : function() {
        var isValid = this.validate();

        var cornorButton =
            <FloatingActionButton
                onClick={this.onSubmit}
                style={floatBottomBtnStyle}
                disabled={!isValid}
            >
                <Delete />
            </FloatingActionButton>;

        return (
            <div className="indentSides">
                <div>
                    <LabeledSliderComponent
                        label="Amount used (percent)"
                        min={0}
                        max={100}
                        step={1}
                        defaultValue={50}
                        onChange={this.handleWasted}
                    />
                </div>
                {cornorButton}
            </div>
        )
	}
});

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = DeleteProductComponent;