var _colors = require('material-ui/lib/styles/colors');

var _colorManipulator = require('material-ui/lib/utils/color-manipulator');

var _spacing = require('material-ui/lib/styles/spacing');

module.exports = {
  spacing: _spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: _colors.grey800,
    primary2Color: _colors.grey800,
    primary3Color: _colors.grey400,
    accent1Color: _colors.lightGreen700,
    accent2Color: _colors.grey100,
    accent3Color: _colors.grey500,
    textColor: _colors.darkBlack,
    alternateTextColor: _colors.white,
    canvasColor: _colors.white,
    borderColor: _colors.grey300,
    disabledColor: _colorManipulator.fade(_colors.darkBlack, 0.3),
    pickerHeaderColor: _colors.grey500,
    clockCircleColor: _colorManipulator.fade(_colors.darkBlack, 0.07),
    shadowColor: _colors.fullBlack
  }
};