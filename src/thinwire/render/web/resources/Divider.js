/*
#IFNDEF ALT_LICENSE
                           ThinWire(R) RIA Ajax Framework
                 Copyright (C) 2003-2006 Custom Credit Systems

  This library is free software; you can redistribute it and/or modify it under
  the terms of the GNU Lesser General Public License as published by the Free
  Software Foundation; either version 2.1 of the License, or (at your option) any
  later version.

  This library is distributed in the hope that it will be useful, but WITHOUT ANY
  WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
  PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public License along
  with this library; if not, write to the Free Software Foundation, Inc., 59
  Temple Place, Suite 330, Boston, MA 02111-1307 USA

  Users who would rather have a commercial license, warranty or support should
  contact the following company who invented, built and supports the technology:
  
                Custom Credit Systems, Richardson, TX 75081, USA.
   	            email: info@thinwire.com    ph: +1 (888) 644-6405
 	                        http://www.thinwire.com
#ENDIF
#IFDEF ALT_LICENSE
#LICENSE_HEADER#
#ENDIF
#VERSION_HEADER#
*/
var tw_Divider = tw_Component.extend({
    construct: function(id, containerId, props) {
        arguments.callee.$.call(this, "div", "divider", id, containerId);
        this._fontBox = null;
        var s = this._box.style;
        s.backgroundColor = tw_COLOR_TRANSPARENT;
        tw_addEventListener(this._box, ["click", "dblclick"], this._clickListener.bind(this));

        var tagLine = this._borderBox = document.createElement("div");
        var s = tagLine.style;
        s.position = "absolute";
        s.lineHeight = "0px";        
        this._box.appendChild(tagLine);
        this.init(-1, props);
    },
    
    _clickListener: tw_Component.clickListener,    
         
    _recalc: function() {
        if (this._width != -1 && this._height != -1) {
            var s = this._box.firstChild.style;
            
            if (this._width >= this._height) {
                s.left = "0px";
                s.top = Math.floor((this._height - this._borderSizeSub) / 2) + "px";
                var width = this._width - this._borderSizeSub;
                if (width < 0) width = 0;
                s.width = width + "px";
                s.height = "0px";
            } else if (this._width < this._height) {
                s.left = Math.floor((this._width - this._borderSizeSub) / 2) + "px"
                s.top = "0px";
                s.width = "0px";
                var height = this._height - this._borderSizeSub;
                if (height < 0) height = 0;
                s.height = height + "px";                
            }
        }
    },
    
    setWidth: function(width) {
        arguments.callee.$.call(this, width);
        this._recalc();
    },
    
    setHeight: function(height) {
        arguments.callee.$.call(this, height);        
        this._recalc();
    }        
});


