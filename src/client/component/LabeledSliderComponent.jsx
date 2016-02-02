var React = require('react');

var Slider = require('material-ui/lib/slider')

var LabeledSliderComponent = React.createClass({
    getInitialState : function() {
        return {
            value : this.props.defaultValue,
        };
    },

    onChange : function(_, val) {
        this.setState({
            value : val,
        });

        this.props.onChange(_, val);

        return true;
    },

    render : function() {
        var quantityText =
            <div
                style={{
                    color: 'rgba(0,0,0,0.3)',
                    fontSize: '16px',
                    fontFamily: 'Roboto',
                    marginBottom: '-20px',
                    marginTop: '10px',
                }}>
                {this.props.label + ": " + this.state.value}
            </div>;

        var cpy = clone(this.props);
        cpy.onChange = this.onChange;

        return (
            <div>
                {quantityText}
                <Slider {...cpy} />
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

module.exports = LabeledSliderComponent;