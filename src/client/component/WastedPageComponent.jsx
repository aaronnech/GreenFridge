var React = require('react');
var PieChart = require("react-chartjs").Pie;

var data = [
    {
        value: 300,
        color:"#F7464A",
        highlight: "#FF5A5E",
        label: "Red"
    },
    {
        value: 50,
        color: "#46BFBD",
        highlight: "#5AD3D1",
        label: "Green"
    },
    {
        value: 100,
        color: "#FDB45C",
        highlight: "#FFC870",
        label: "Yellow"
    }
];

var WastedPageComponent = React.createClass({
    render : function() {
        return (
            <div className='indentSides'>
                <div style={{marginTop : '64px'}}>
                    <PieChart data={data} />
                </div>
            </div>
        )
	}
});

module.exports = WastedPageComponent;