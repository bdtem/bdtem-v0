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

        self.trunk.attr({
          x2: value
        });
      };
    }
  },
  HORIZONTAL_SPAN: {
    span: true,
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

        self.trunk.attr({
          x1: 2 * self.start - value,
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
      var txt = self.textNode;

      if (txt) {
        var bBox = txt.getBBox();
        var heightOffset = self.length > 0 ? bBox.height : -bBox.height;

        return function (value) {
          txt.attr({y: value + heightOffset});
          self.trunk.attr({
            y2: value
          });
        };

      } else {

        return function (value) {
          self.trunk.attr({
            y2: value
          });
        }

      }

    }
  },
  VERTICAL_SPAN: {
    span: true,
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
          txt.attr({y: self.length < 0 ? value - (txt.getBBox().height) : value});
        }

        self.trunk.attr({
          y1: 2 * self.start - value,
          y2: value
        });
      };
    }

  }
};


var OFF_SCREEN = -1024;


//Define orthogonalities:
BRANCH_TYPE.HORIZONTAL.orthogonal = BRANCH_TYPE.VERTICAL;
BRANCH_TYPE.HORIZONTAL_SPAN.orthogonal = BRANCH_TYPE.VERTICAL;
BRANCH_TYPE.VERTICAL.orthogonal = BRANCH_TYPE.HORIZONTAL;
BRANCH_TYPE.VERTICAL_SPAN.orthogonal = BRANCH_TYPE.HORIZONTAL;

