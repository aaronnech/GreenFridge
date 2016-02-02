var React = require('react');
var Cache = require('../Cache');
var ReactFireMixin = require('reactfire');
var Constants = require('../Constants');

var TextField = require('material-ui/lib/text-field');
var FloatingActionButton = require('material-ui/lib/floating-action-button');
var ContentAdd = require('material-ui/lib/svg-icons/content/add');
var Search = require('material-ui/lib/svg-icons/action/search');
var Delete = require('material-ui/lib/svg-icons/action/delete');
var Graph = require('material-ui/lib/svg-icons/av/equalizer');
var Toolbar = require('material-ui/lib/toolbar/toolbar');
var ToolbarGroup = require('material-ui/lib/toolbar/toolbar-group');
var Card = require('material-ui/lib/card/card');
var CardActions = require('material-ui/lib/card/card-actions');
var CardHeader = require('material-ui/lib/card/card-header');
var CardMedia = require('material-ui/lib/card/card-media');
var CardTitle = require('material-ui/lib/card/card-title');
var FlatButton = require('material-ui/lib/flat-button');
var CardText = require('material-ui/lib/card/card-text');
var IconButton = require('material-ui/lib/icon-button');

var floatBottomBtnStyle = {
	zIndex: 100,
    position: 'fixed',
    bottom: 10,
    right: 10,
};

var HomePageComponent = React.createClass({
    mixins: [ReactFireMixin],
    searchFocus : false,
    barcodeTimer : null,
    barcode : [],

    componentWillMount : function() {
        var firebaseRef = new Firebase(Constants.fireAccess + 'products/');
        this.bindAsArray(firebaseRef, 'products');

        document.addEventListener("keydown", this.handleKey, false);
    },

	componentWillUnmount : function() {
		document.removeEventListener("keydown", this.handleKey, false);
		this.resetBarcode();
	},

	handleKey : function(e) {
		if (!this.searchFocus) {
			if (!this.barcodeTimer) {
				this.barcodeTimer = setTimeout(this.checkBarcode, 100);
			}
			this.barcode.push(e.keyCode);
		} else {
			this.resetBarcode();
		}
	},

	checkBarcode : function() {
		// Check for valid barcode
		var code = null;
		if (this.barcode.length == 13 &&
			this.barcode[12] == 13) {
			this.barcode.pop();
			code = this.barcode.map(function(c) {
				return '' + (c - 48)
			}).join('');
		}

		this.resetBarcode();

		if (code != null) {
			this.props.onAddProduct(code);
		}
	},

	resetBarcode : function() {
		clearTimeout(this.barcodeTimer)
		this.barcodeTimer = null;
		this.barcode = [];
	},

    getInitialState : function() {
        return {
        	filterString : '',
        };
    },

    filterProducts : function(e) {
    	this.setState({
    		filterString : e.target.value,
    	});
    },

    onSearchFocus : function() {
    	this.searchFocus = true;
    },

    onSearchBlur : function() {
    	this.searchFocus = false;
    },

    editProduct : function(key) {
    	this.props.onEditProduct(key);
    },

    deleteProduct : function(key) {
    	this.props.onDeleteProduct(key);
    },

    render : function() {
        var cornorButton = (
	        <FloatingActionButton
	            onClick={this.props.onAddProduct}
	            style={floatBottomBtnStyle}
	        >
	            <ContentAdd />
	        </FloatingActionButton>
	    );

	    var items = this.state.products.filter((function(p) {
	    	if (this.state.filterString == '') return true;
	    	return p.name.toLowerCase().indexOf(this.state.filterString) > -1;
	    }).bind(this)).map((function(p, i) {
	    	var now = new Date();
	    	now = now.getTime();
	    	var diff = Math.abs(p.date - now);
	    	var days = Math.round(diff / 86400000);

			return (
				<Card
					className="productCard"
					key={i}
					onClick={(function() {this.editProduct(p['.key'])}).bind(this)}
				>
					<CardHeader
					  title={p.name}
					  subtitle={days + " days"}
					  avatar="http://lorempixel.com/100/100/nature/"
					>
						<div style={{float: 'right'}}>
							<IconButton
								onClick={(function(e) {
									this.deleteProduct(p['.key']);
									e.stopPropagation();
								}).bind(this)}
							>
								<Delete />
							</IconButton>
						</div>
					</CardHeader>
				</Card>
			);
		}).bind(this));

        return (
        	<div>
        		<Toolbar>
        			<ToolbarGroup firstChild={true} style={{margin: 0}}>
        				<Search style={{marginBottom: '-7px'}} />
	            		<TextField
	            			hintText="Search..."
	            			onBlur={this.onSearchBlur}
	            			onFocus={this.onSearchFocus}
	            			onChange={this.filterProducts}
	            		/>
	            	</ToolbarGroup>
	            </Toolbar>
	            {cornorButton}
	            <div className="indentSides">
	            	{items}
	            </div>
	        </div>
        );
    }
});

module.exports = HomePageComponent;