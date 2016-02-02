var React = require('react');
var Auth = require('../Auth');
var ProductAPI = require('../ProductAPI');
var Cache = require('../Cache');
var Constants = require('../Constants');

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var AppBar = require('material-ui/lib/app-bar');
var CircularProgress = require('material-ui/lib/circular-progress');
var IconButton = require('material-ui/lib/icon-button');
var ArrowBack = require('material-ui/lib/svg-icons/navigation/arrow-back');
var MoreVertIcon = require('material-ui/lib/svg-icons/navigation/more-vert');
var ThemeManager = require('material-ui/lib/styles/theme-manager');
var IconMenu = require('material-ui/lib/menus/icon-menu')
var MenuItem = require('material-ui/lib/menus/menu-item');
var Theme = require('../theme/Theme');

var FacebookAuthPageComponent = require('./FacebookAuthPageComponent.jsx');
var HomePageComponent = require('./HomePageComponent.jsx')
var GreenFridgeIconComponent = require('./GreenFridgeIconComponent.jsx')
var EditProductComponent = require('./EditProductComponent.jsx');
var DeleteProductComponent = require('./DeleteProductComponent.jsx');
var WastedPageComponent = require('./WastedPageComponent.jsx');

var AppComponent = React.createClass({
    childContextTypes : {
        muiTheme: React.PropTypes.object,
    },

    getChildContext : function() {
        return {
            muiTheme: ThemeManager.getMuiTheme(Theme),
        };
    },

    setScreenLater : function(screen, ignoreHistory) {
        var self = this;
        return function() {
            var stack = self.state.history;
            if (!ignoreHistory) {
                stack.push(self.state.active);
            } else {
                stack = [];
            }

            self.setState({
                active : screen,
                history : stack,
            });
        };
    },

    componentWillMount : function() {
        var self = this;

        ProductAPI.load(function() { 
            self.setState({loading : false});
        });
    },

    getInitialState : function() {
        if (!Auth.isAuth()) {
            return {
                active : Constants.SCREENS.FACEBOOK,
                history : [],
                loading : true,
            };
        } else {
            return {
                active : Constants.SCREENS.HOME,
                history : [],
                loading : true,
            };
        }
    },

    onPopHistory : function() {
        var stack = this.state.history;
        var screen = stack.pop();

        this.setState({history : stack});

        this.setScreenLater(screen, true)();  
    },

    onEditProduct : function(key) {
        this.setState({productKey : key});
        this.setScreenLater(Constants.SCREENS.EDIT_PRODUCT)();
    },

    onDeleteProduct : function(key) {
        this.setState({productKey : key});
        this.setScreenLater(Constants.SCREENS.DELETE_PRODUCT)();
    },

    onAddProduct : function(code) {
        if (typeof(code) == 'string') {
            this.setState({loading : true});
            ProductAPI.lookup(code, (function(c) {
                var details = null;
                if (c) {
                    details = {
                        name : c[4]
                    };
                }

                this.setState({loading : false, productDetails : details});
                this.setScreenLater(Constants.SCREENS.ADD_PRODUCT)();
            }).bind(this));
        } else {
            this.setState({loading : false, productDetails : null});
            this.setScreenLater(Constants.SCREENS.ADD_PRODUCT)();
        }
    },

    logout : function() {
        Auth.deAuth();
        this.setScreenLater(Constants.SCREENS.FACEBOOK, true)();
    },

    render : function() {
        var screen = null;
        var title = 'GreenFridge';
        var topMenu = (
            <IconMenu
                iconButtonElement={
                    <IconButton><MoreVertIcon /></IconButton>
                }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            >
                <MenuItem
                    primaryText="How much have I wasted?"
                    onClick={this.setScreenLater(Constants.SCREENS.WASTED)}
                />
                <MenuItem primaryText="Logout" onClick={this.logout} />
            </IconMenu>
        );

        switch (this.state.active) {
            case Constants.SCREENS.FACEBOOK:
                screen =
                    <FacebookAuthPageComponent
                        onSuccess={this.setScreenLater(Constants.SCREENS.HOME, true)}
                    />;
                title = 'Login';
                topMenu = null;
                break;
            case Constants.SCREENS.WASTED:
                screen =
                    <WastedPageComponent />;
                title = 'Waste Statistics';
                break;
            case Constants.SCREENS.HOME:
                screen =
                    <HomePageComponent
                        onDeleteProduct={this.onDeleteProduct}
                        onEditProduct={this.onEditProduct}
                        onAddProduct={this.onAddProduct}
                    />;
                break;
            case Constants.SCREENS.ADD_PRODUCT:
                screen =
                    <EditProductComponent
                        productKey={null}
                        productDetails={this.state.productDetails}
                        onSubmit={this.setScreenLater(Constants.SCREENS.HOME, true)}
                    />;
                title = 'Add Product';
                topMenu = null;
                break;
            case Constants.SCREENS.DELETE_PRODUCT:
                screen =
                    <DeleteProductComponent
                        productKey={this.state.productKey}
                        onSubmit={this.setScreenLater(Constants.SCREENS.HOME, true)}
                    />;
                title = 'Remove Product';
                break;
            case Constants.SCREENS.EDIT_PRODUCT:
                screen =
                    <EditProductComponent
                        productKey={this.state.productKey}
                        onSubmit={this.setScreenLater(Constants.SCREENS.HOME, true)}
                    />;
                title = 'Edit Product';
                break;
        }

        var topIcon = this.state.history.length > 0
            ? <IconButton onClick={this.onPopHistory}><ArrowBack /></IconButton>
            : <GreenFridgeIconComponent />;

        return (
            <div id="app">
                <AppBar
                    iconElementLeft={topIcon}
                    iconElementRight={topMenu}
                    title={title}
                />
                <div className='screen'>
                    {this.state.loading ? <CircularProgress size={1.5} /> : screen}
                </div>
            </div>
        );
    }
});

module.exports = AppComponent;