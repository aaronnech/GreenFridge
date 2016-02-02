var React = require('react');
var Constants = require('../Constants');
var ReactFireMixin = require('reactfire');

var DatePicker = require('material-ui/lib/date-picker/date-picker');
var TextField = require('material-ui/lib/text-field');
var FloatingActionButton = require('material-ui/lib/floating-action-button');
var Check = require('material-ui/lib/svg-icons/navigation/check');
var SelectField = require('material-ui/lib/select-field');
var MenuItem = require('material-ui/lib/menus/menu-item');

var LabeledSliderComponent = require('./LabeledSliderComponent.jsx')

var floatBottomBtnStyle = {
    zIndex: 100,
    position: 'fixed',
    bottom: 10,
    right: 10,
};

var EditProductComponent = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState : function() {
        return {
            category: 0,
            date: null,
            name: this.props.productDetails ? this.props.productDetails.name : '',
            quantity: 1,
            valid: false,
        };
    },

    componentWillMount : function() {
        var firebaseRef = new Firebase(Constants.fireAccess + 'products/');
        this.bindAsArray(firebaseRef.limitToLast(25), 'products');
    },

    handleName : function(e) {
        this.setState({
            name : e.target.value,
        });
    },

    handleCategory : function(event, index, value) {
        this.setState({
            category : index,
        });
    },

    handleDate : function(_, val) {
        this.setState({
            date : val.getTime(),
        });
    },

    handleQuantity : function(e) {
        if (!isNumeric(e.target.value)) return;

        this.setState({
            quantity : Math.round(Number(e.target.value)),
        });
    },

    onSubmit : function() {
        if (!this.validate()) return;

        this.firebaseRefs['products'].push({
            date : this.state.date,
            quantity : this.state.quantity,
            name : this.state.name,
        });

        this.props.onSubmit();
    },

    validate : function() {
        return this.state.date != null &&
        isNumeric(this.state.quantity) &&
        this.state.quantity > 0 &&
        this.state.name != '';
    },

    render : function() {
        var isValid = this.validate();

        var cornorButton =
            <FloatingActionButton
                onClick={this.onSubmit}
                style={floatBottomBtnStyle}
                disabled={!isValid}
            >
                <Check />
            </FloatingActionButton>;

        return (
            <div className="indentSides">
                <div>
                    <TextField hintText="Product Name" defaultValue={this.state.name} onChange={this.handleName} />
                </div>
                <div>
                    <SelectField
                        floatingLabelText="Category"
                        value={this.state.category}
                        onChange={this.handleCategory}>
                        {Constants.CATEGORIES.map((function(c, i) {
                            return (
                                <MenuItem key={i} value={i} primaryText={c} />
                            );
                        }).bind(this))}
                    </SelectField>
                </div>
                <div>
                    <DatePicker hintText="Expiration Date" onChange={this.handleDate} />
                </div>
                <div>
                    <TextField hintText="Quantity" type='number' label="Quantity" defaultValue={1} onChange={this.handleQuantity} />
                </div>
                {cornorButton}
            </div>
        )
	}
});

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

module.exports = EditProductComponent;