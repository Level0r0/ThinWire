/*
 *                      ThinWire(TM) RIA Ajax Framework
 *              Copyright (C) 2003-2006 Custom Credit Systems
 * 
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation; either version 2 of the License, or (at your option) any later
 * version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, write to the Free Software Foundation, Inc., 59 Temple
 * Place, Suite 330, Boston, MA 02111-1307 USA
 *
 * Users wishing to use this library in proprietary products which are not 
 * themselves to be released under the GNU Public License should contact Custom
 * Credit Systems for a license to do so.
 * 
 *               Custom Credit Systems, Richardson, TX 75081, USA.
 *                          http://www.thinwire.com
 */
tw_SplitLayout = Class.extend({
    _comp: null,
    _vertical: true,
    _drag: null,
    
    construct: function(id) {
        this._comp = tw_Component.instances[id];
        this._drag = new tw_DragHandler(this._comp._box, this._dragListener.bind(this));
        this._vertical = this._comp.getWidth() < this._comp.getHeight();
        this._comp._box.style.cursor = this._vertical ? "W-resize" : "N-resize";
    },
    
    _dragListener: function(ev) {        
        if (ev.type == 0) {
            this._comp._box.style.backgroundColor = "black";
            this._vertical = this._comp.getWidth() < this._comp.getHeight();
        } else if (ev.type == 1) {
            if (this._vertical) {
                this._comp._box.style.cursor = "W-resize";
                var x = this._comp.getX() + ev.changeInX;
                if (x < 0) x = 0;
                this._comp.setX(x);
            } else {
                this._comp._box.style.cursor = "N-resize";
                var y = this._comp.getY() + ev.changeInY;
                if (y < 0) y = 0;
                this._comp.setY(y);
            }
        } else if (ev.type == 2) {
            this._comp._box.style.backgroundColor = "transparent";
            tw_em.sendViewStateChanged(this._comp._id, "position", this._comp.getX() + "," + this._comp.getY());            
        }
    },
    
    destroy: function() {
        this._drag.destroy();
    }
});

tw_SplitLayout.newInstance = function(id) {
    new tw_SplitLayout(id);
};