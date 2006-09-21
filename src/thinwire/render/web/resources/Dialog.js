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
//TODO: Opera does not support dragging the dialog window around.
//TODO: When a second modal dialog is presented and then closed the first dialog does not remain modal.
//      Additionally, the prior dialog should be given focus.
//TODO: The menu bar of the frame is still active when a modal dialog is visible.
var tw_Dialog = tw_BaseContainer.extend({
    _closeButton: null,
    _menu: null,
    _standardButton: null,
    _modalFlashCount: -1,
    _moveDrag: null,
    _resizeDrag: null,
    _imageResize: "url(?_twr_=dResize.png)",
    
    construct: function(id, containerId, props) {
        this.$.construct.apply(this, ["dialog", id, 0]);
        var dialog = this._box;
        var s = dialog.style;
        s.cursor = "default";    
        s.overflow = "visible";
        s.padding = "1px";
        s.border = "2px outset";
        s.backgroundColor = "threedface";        
        s.borderColor = tw_borderColor;
        
        var title = document.createElement("div");
        var s = title.style;
        s.paddingLeft = "2px";
        s.marginBottom = "1px";
        s.height = "18px";    
        s.lineHeight = "17px";
        s.whiteSpace = "nowrap";
        s.overflow = "hidden";
        s.backgroundColor = "activecaption";
        s.color = "captiontext";
        s.fontFamily = "tahoma, sans-serif";
        s.fontSize = "8pt";
        s.fontWeight = "bold";        
        title.appendChild(document.createTextNode(""));
        this._moveDrag = new tw_DragHandler(title, this._moveDragListener.bind(this));                
        
        var closeButton = document.createElement("div");
        var s = closeButton.style;
        s.textAlign = "center";
        s.position = "absolute";
        s.margin = "0px";
        s.color = "black";
        s.padding = "1px";    
        s.border = "2px outset";
        s.overflow = "hidden";
        s.backgroundColor = "buttonface";
        s.borderColor = tw_borderColor;
        s.top = "3px";
        s.right = "3px";
        s.lineHeight = 8 + "px";        
        var subtractSize = tw_sizeIncludesBorders ? 0 : tw_CALC_BORDER_PADDING_SUB;
        s.width = 16 - subtractSize + "px";
        s.height = 14 - subtractSize + "px";        
        closeButton.appendChild(document.createTextNode("X"));
        
        title.appendChild(closeButton);    
        dialog.appendChild(title);
             
        var container = document.createElement("div");
        container.className = "container";
        var s = container.style;
        s.backgroundColor = "threedface";
        s.position = "absolute";
        dialog.appendChild(container);

        tw_Frame.active.setModalLayerVisible(true, this);
        
        tw_addEventListener(closeButton, "mousedown", this._closeButtonMouseDownListener.bind(this));
        tw_addEventListener(closeButton, ["mouseup", "mouseout"], this._closeButtonMouseUpListener.bind(this)); 
        tw_addEventListener(closeButton, "click", this._closeButtonClickListener.bind(this));
        this.setActive = this.setActive.bind(this);
        this.setActive(true);
        this._closeButton = closeButton;
        this._container = container;

        this.init(-1, props);
    },
        
    _moveDragListener: function(ev) {
        if (ev.type == 1) {
            var x = this.getX() + ev.changeInX;
            var y = this.getY() + ev.changeInY;
            if (x < 0) x = 0;
            if (y < 0) y = 0;                        
            this.setX(x);
            this.setY(y);
        } else if (ev.type == 2) {            
            tw_em.sendViewStateChanged(this._id, "position", this.getX() + "," + this.getY());
        }
    },
    
    _resizeDragListener: function(ev) {
        if (ev.type == 1) {
            var width = this.getWidth() + ev.changeInX;
            var height = this.getHeight() + ev.changeInY;
            if (width < 50) width = 50;
            if (height < 50) height = 50;                        
            this.setWidth(width);
            this.setHeight(height);
        } else if (ev.type == 2) {            
            tw_em.sendViewStateChanged(this._id, "size", this.getWidth() + "," + this.getHeight());
        }
    },
    
    _closeButtonMouseDownListener: function(ev) {
        this.setFocus(true);
        if (tw_getEventButton(ev) != 1) return;  //only if left click        
        this._closeButton.style.border = "2px inset";
        this._closeButton.style.borderColor = tw_borderColor;        
        ev.cancelBubble = true; //TODO: is this cross browser?
    },
    
    _closeButtonMouseUpListener: function(ev) {
        this._closeButton.style.border = "2px outset";
        this._closeButton.style.borderColor = tw_borderColor;        
        ev.cancelBubble = true;
    },       

    _closeButtonClickListener: function(ev) {
        tw_em.sendViewStateChanged(this._id, "closeClick", null);
    },    

    setResizeAllowed: function(resizeAllowed) {
        if (resizeAllowed) {
            if (this._resizeDrag != null) return;
            var sizer = document.createElement("div");
            var s = sizer.style;
            s.width = "12px";
            s.height = "12px";
            s.position = "absolute";
            s.overflow = "hidden";
            s.backgroundImage = this._imageResize;
            s.backgroundRepeat = "no-repeat";
            s.backgroundPosition = "top right";
            s.right = "0px";
            s.bottom = "0px";
            s.cursor = "NW-resize";
            this._box.appendChild(sizer);
            this._resizeDrag = new tw_DragHandler(sizer, this._resizeDragListener.bind(this));            
        } else {
            if (this._resizeDrag == null) return;
            this._box.removeChild(this._resizeDrag.getBox());
            this._resizeDrag.destroy();
            this._resizeDrag = null;
        }
    },
    
    setY: function(y) {
        if (tw_Frame.active.getMenu() != null) y += tw_Dialog.menuBarHeight;            
        this.$.setY.apply(this, [y]);
    },
    
    getY: function() {
        var y = this.$.getY.apply(this, []);
        if (tw_Frame.active.getMenu() != null) y -= tw_Dialog.menuBarHeight;
        return y;
    },
    
    setWidth: function(width) {
        this._width = width;
        this._box.style.width = width - (tw_sizeIncludesBorders ? 0 : tw_CALC_BORDER_PADDING_SUB) + "px";
        width = width - tw_CALC_BORDER_PADDING_SUB;
        this._container.style.width = width + "px";
    },
    
    setHeight: function(height) {
        this._height = height;
        this._box.style.height = height - (tw_sizeIncludesBorders ? 0 : tw_CALC_BORDER_PADDING_SUB) + "px";
        
        if (this._menu == null) {
            height = height - tw_CALC_BORDER_PADDING_SUB - tw_Dialog.titleBarHeight;
        } else {
            height = height - tw_CALC_BORDER_PADDING_SUB - tw_Dialog.titleBarHeight - tw_Dialog.menuBarHeight;
        }       
        
        this._container.style.height = height + "px";
    },
    
    keyPressNotify: tw_BaseContainer.keyPressNotifyCtrlEnterButton,

    setMenu: function(menu) {
        if (this._menu != null) this._box.removeChild(this._menu._box);        
        this._menu = menu;   
        
        if (menu instanceof tw_Menu) {
            menu._box.style.height = tw_Dialog.menuBarHeight - (tw_sizeIncludesBorders ? 0 : 5) + "px";    
            this._box.insertBefore(menu._box, this._container);
            this.setHeight(this._height);
        }
    },
    
    getMenu: function() {
        return this._menu;
    },    
    
    setTitle: function(title) {
        var b = this._box.firstChild;
        b.replaceChild(document.createTextNode(title), b.firstChild);
    },
    
    setFocus: function(focus) {
        if (tw_Frame.active.getMenu() != null) tw_Frame.active.getMenu().close(); 
    
        if (tw_Dialog.active !== this) {     
            if (tw_Dialog.active != null) tw_Dialog.active.setActive(false);            
            this.setActive(true);
        }
        
        return true;
    },
    
    setActive: function(state, flash) {
        if (flash) this._modalFlashCount = 4;
        if (this._box == null) return; // this could be true if the Dialog is set to active after it has been destroyed.
        var s = this._box.firstChild.style;        
 
        if (this._modalFlashCount >= 0) {
            if (this._modalFlashCount == 0) {
                state = true;
            } else {
                setTimeout(this.setActive, 100);
                state = s.backgroundColor == "inactivecaption";
                this._modalFlashCount--;
            }
            
            flash = true;            
        }
               
        if (state) {
            s.backgroundColor = "activecaption";
            s.color = "captiontext";
            tw_Dialog.active = this;
            if (!flash) this._box.style.zIndex = ++tw_Component.zIndex;       
        } else {
            s.backgroundColor = "inactivecaption";
            s.color = "inactivecaptiontext";
            this._moveDrag.releaseDrag();
            if (this.getMenu() != null) this.getMenu().close();            
            if (!flash) tw_Dialog.active = null;
        }
    },
        
    getStandardButton: function() {
        return this._standardButton;
    },

    setStandardButton: function(standardButton) {
        this._standardButton = standardButton;
    },

    destroy: function() {
        //When removeComponent is called on Frame, this destroy method is called again so we want to stop it.
        if (this._closeButton == null) return;
        if (tw_Dialog.active === this) tw_Dialog.active = null;
        this._moveDrag.destroy();
        this._menu = this._standardButton = this._drag = this._closeButton = null;                
        tw_Frame.active.setModalLayerVisible(false);
        //tw_Frame.active.removeComponent(this._id);
        document.body.removeChild(this._box);
        this.$.destroy.apply(this, []);
    }
});

tw_Dialog.menuBarHeight = 23;
tw_Dialog.titleBarHeight = 18 + 1; //actual height plus one for bottom margin
tw_Dialog.active = null;

