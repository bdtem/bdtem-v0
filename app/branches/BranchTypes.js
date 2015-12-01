/**
 * Created by alacasse on 11/30/15.
 */


var BRANCH_TYPE = {
  HORIZONTAL: {
    value: 0,
    name: 'Horizontal',
    shortName: 'H',
    animationParam: 'x2',
    getStartX: function (branch) {
      return branch.start;
    },
    getStartY: function (branch) {
      return branch.fixed;
    },
    getEndX: function (branch) {
      return branch.length ? branch.start + branch.length : branch.start;
    },
    getEndY: function (branch) {
      return branch.fixed;
    },
    updateAnimation: function () {
      var self = this;
      return function (value) {

        var txt = self.textNode;
        if (txt) {
          txt.attr({x: self.length < 0 ? value - (txt.getBBox().width + 1) : value});
        }

        self.branchLine.attr({
          x2: value
        });
      };
    }
  },
  HORIZONTAL_SPAN: {
    value: 1,
    name: "Horizontal Span",
    shortName: "Hs",
    animationParam: 'x2',
    getStartX: function (branch) {
      return branch.start;
    },
    getStartY: function (branch) {
      return branch.fixed;
    },
    getEndX: function (branch) {
      return branch.length ? branch.start + branch.length : branch.start;
    },
    getEndY: function (branch) {
      return branch.fixed;
    },
    updateAnimation: function () {
      var self = this;
      return function (value) {

        var txt = self.textNode;
        if (txt) {
          txt.attr({x: self.length < 0 ? value - (txt.getBBox().width + 1) : value});
        }

        self.branchLine.attr({
          x1: 2 * self.startX - value,
          x2: value
        });
      };
    }

  },
  VERTICAL: {
    value: 2,
    name: "Vertical",
    shortName: "V",
    animationParam: 'y2',
    getStartX: function (branch) {
      return branch.fixed;
    },
    getStartY: function (branch) {
      return branch.start;
    },
    getEndX: function (branch) {
      return branch.fixed;
    },
    getEndY: function (branch) {
      return branch.length ? branch.start + branch.length : branch.start;
    },
    updateAnimation: function () {
      var self = this;
      return function (value) {

        var txt = self.textNode;
        if (txt) {
          txt.attr({y: self.length < 0 ? value - (txt.getBBox().height + 1) : value});
        }

        self.branchLine.attr({
          y2: value
        });
      };
    }

  },
  VERTICAL_SPAN: {
    value: 3,
    name: "Vertical Span",
    shortName: "Vs",
    animationParam: 'y2',
    getStartX: function (branch) {
      return branch.fixed;
    },
    getStartY: function (branch) {
      return branch.start;
    },
    getEndX: function (branch) {
      return branch.fixed;
    },
    getEndY: function (branch) {
      return branch.length ? branch.start + branch.length : branch.start;
    },
    updateAnimation: function () {
      var self = this;
      return function (value) {

        var txt = self.textNode;
        if (txt) {
          txt.attr({y: self.length < 0 ? value - (txt.getBBox().width + 1) : value});
        }

        self.branchLine.attr({
          y1: 2 * self.startY - value,
          y2: value
        });
      };
    }

  }
};


var OFF_SCREEN = -1024;
function buildTextNode(text, x, y, centerX, centerY) {
  if (text) {
    var textNode = paper.text(OFF_SCREEN, OFF_SCREEN, text);
    var textBBox = textNode.getBBox();
    var height = textBBox.height;
    var width = textBBox.width;

    textNode.attr({
      'font-family': 'Libre Baskerville',
      x: centerX ? (x - width / 2) : x,
      y: centerY ? (y + height / 2) : y,
      fill: (text.length === 6 && Number('0x' + text) > 0) ? ('#' + text) : STROKE_COLOR
    });

    textNode.click(function (event) {
      event.stopPropagation();
      textNode.attr({fill: '#F0F', filter: shadowFilter});
      textNode.node.innerHTML = 'clicks'
    });
    return textNode;
  } else {
    return undefined;
  }
}
//Define orthogonalities:
BRANCH_TYPE.HORIZONTAL.orthogonal = BRANCH_TYPE.VERTICAL;
BRANCH_TYPE.HORIZONTAL_SPAN.orthogonal = BRANCH_TYPE.VERTICAL;
BRANCH_TYPE.VERTICAL.orthogonal = BRANCH_TYPE.HORIZONTAL;
BRANCH_TYPE.VERTICAL_SPAN.orthogonal = BRANCH_TYPE.HORIZONTAL;

