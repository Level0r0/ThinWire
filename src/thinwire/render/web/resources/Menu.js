/*
                         ThinWire(TM) RIA Ajax Framework
               Copyright (C) 2003-2006 Custom Credit Systems
  
  This program is free software; you can redistribute it and/or modify it under
  the terms of the GNU General Public License as published by the Free Software
  Foundation; either version 2 of the License, or (at your option) any later
  version.
  
  This program is distributed in the hope that it will be useful, but WITHOUT
  ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
  FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
  
  You should have received a copy of the GNU General Public License along with
  this program; if not, write to the Free Software Foundation, Inc., 59 Temple
  Place, Suite 330, Boston, MA 02111-1307 USA
 
  Users wishing to use this library in proprietary products which are not 
  themselves to be released under the GNU Public License should contact Custom
  Credit Systems for a license to do so.
  
                Custom Credit Systems, Richardson, TX 75081, USA.
                           http://www.thinwire.com
 #VERSION_HEADER#
 */
var tw_Menu = tw_Component.extend({
    _menusAreVisible: false,
    _activeMenuItem: null,
    _windowMenu: false,
    
    construct: function(id, containerId, props) {
        arguments.callee.$.call(this, "div", "mainMenu", id, containerId);
        this._windowMenu = props.windowMenu;                
        delete props.windowMenu;

        var s = this._box.style;
        s.overflow = "visible";
        s.padding = "1px";
        s.zIndex = "1";
        if (this._windowMenu) s.position = "";

        this._boxSizeSub = tw_sizeIncludesBorders ? 0 : parseInt(s.padding) * 2; 
        
        this._mainMenuMouseOver = this._mainMenuMouseOver.bind(this);
        this._mainMenuMouseDown = this._mainMenuMouseDown.bind(this);
        this._mainMenuMouseOut = this._mainMenuMouseOut.bind(this);
        this._mainMenuClick = this._mainMenuClick.bind(this);
        
        this._itemMouseOver = this._itemMouseOver.bind(this);
        this._itemClick = this._itemClick.bind(this);        

        var initData = props.initData;
        delete props.initData;
        this.init(-1, props);
        this._load(this._box, initData);
    },
    
    setHeight: function(height) {
        arguments.callee.$.call(this, height);
        this._mainItemSub = this._borderSizeSub + this._boxSizeSub;
        
        if (!tw_sizeIncludesBorders) {
            var borderWidth = 1;
            var paddingTop = 2;
            var paddingBottom = 2;
            this._mainItemSub += borderWidth * 2 + paddingTop + paddingBottom;
        }
        
        var nodes = this._box.childNodes;
        
        for (var i = nodes.length; --i >= 0;) {
            nodes.item(i).firstChild.style.lineHeight = this._height - this._mainItemSub + "px";
        }
    },
    
    setStyle: function(name, value) {
        arguments.callee.$.call(this, name, value);

        if (name == "backgroundColor" || name.indexOf("border") == 0) {
            if (this._windowMenu) {
                var s = this._box.style;
                s.borderWidth = "0px";
                s.borderTopWidth = "1px";
                s.borderTopStyle = "solid";
                s.borderTopColor = this._backgroundColor;
                s.paddingBottom = "2px";
                s.borderBottomWidth = "2px";
                s.borderBottomStyle = "groove";
            }       

            var nodes = this._box.childNodes;
            if (name == "borderSize") value += "px";
            else if (name == "borderColor") value = tw_Component.getIEBorder(value, this._borderType);
            name = tw_Component.styleNameMap[name];
            
            for (var i = nodes.length; --i >= 0;) {
                var item = nodes.item(i);
                this._setHighlight(item, false);
                this.applyStyle(item.lastChild, name, value);
            }
        }
    },
    
    applyStyle: function(content, name, value) {
        content.style[name] = value;
        
        for (var i = content.childNodes.length; --i >= 0;) {
            var item = content.childNodes.item(i);
            
            if (item.className == "menuDivider") {
                var s = item.style;

                if (name == "borderColor") {
                    s[name] = value;
                } else if (name == "borderWidth") {
                    var borderSize = parseInt(value) / 2;        
                    s.borderTopWidth = Math.floor(borderSize) + "px";
                    s.borderRightWidth = "0px";
                    s.borderLeftWidth = "0px";
                    s.borderBottomWidth = (borderSize < 1 ? 1 : Math.floor(borderSize)) + "px";
                } else if (name == "borderStyle") {
                    s[name].borderStyle = this._getReverseBorderStyle(value);
                }
            } else {
                this.applyStyle(item.lastChild, name, value);
            }
        }
    },

    _getReverseBorderStyle: function(borderStyle) {
        if (borderStyle == "inset") borderStyle = "outset";
        else if (borderStyle == "outset") borderStyle = "inset";
        else if (borderStyle == "groove") borderStyle = "ridge";
        else if (borderStyle == "ridge") borderStyle = "groove";
        return borderStyle;        
    },    
    
    _mainMenuMouseOver: function(event) {
        var overItem = tw_getEventTarget(event, "menuItem");
        
        if (overItem == null) {
            var overItem = tw_getEventTarget(event, "mainMenuItem");                
            var mainMenu = overItem.parentNode;
                
            for (var i = mainMenu.childNodes.length - 1; i >= 0; i--) {
                var item = mainMenu.childNodes.item(i);
                
                if (item === overItem) {
                    this._setHighlight(item, true);
                    if (this._menusAreVisible) this._open(item);
                } else {
                    this._setHighlight(item, false);
                    this.close(item);
                }
            }
        }
    },
        
    _mainMenuMouseDown: function(event) {
        var overItem = tw_getEventTarget(event, "menuItem");
        
        if (overItem == null) {
            var item = tw_getEventTarget(event, "mainMenuItem");    
            this.close(item);
            this._menusAreVisible = this._menusAreVisible ? false : true;
            this._setHighlight(item, true);
            if (this._menusAreVisible) this._open(item);
        }
    },
                
    _mainMenuMouseOut: function(event) {
        var overItem = tw_getEventTarget(event, "menuItem");
        
        if (overItem == null) {        
            var item = tw_getEventTarget(event, "mainMenuItem");
            if (!this._menusAreVisible) this._setHighlight(item, false);
        }
    },
                
    _mainMenuClick: function(event) {
        var overItem = tw_getEventTarget(event, "menuItem");
        
        if (overItem == null) {
            var item = tw_getEventTarget(event, "mainMenuItem");
            
            if (!item.disabled && item.lastChild.childNodes.length == 0) {
                this.fireAction("click", this._fullIndex(item));
                this._setHighlight(item, false);
                this._menusAreVisible = false;
            }
        }
    },
    
    _itemMouseOver: function(event) {
        var item = tw_getEventTarget(event, "menuItem");
        var parentContent = item.parentNode;            
        this._setHighlight(item, true);
        
        if (!item.disabled)
            this._open(item);
    },
    
    _itemClick: function(event) {
        var item = tw_getEventTarget(event, "menuItem");
        
        if (this._menusAreVisible && !item.disabled && item.lastChild.childNodes.length == 0) {
            this.fireAction("click", this._fullIndex(item));
            var mainMenuItem = tw_getEventTarget(event, "mainMenuItem");            
            this._menusAreVisible = false;
            this.close(mainMenuItem);
        }
    },    
    
    _calcEmWidth: function(item) {
        var parent = item.parentNode;
        var update = false;
        
        //Need better size calc routine
        var width = this._getText(item).length * .7;                
        
        if (parent.tw_maxTextWidth < width) {
            parent.tw_maxTextWidth = width;
            update = true;
        }
        
        width = this._getKeyPressCombo(item).length * .7;
        
        if (parent.tw_maxShortcutTextWidth < width) {
            parent.tw_maxShortcutTextWidth = width;
            update = true;
        }
        
        if (update)
            parent.style.width = (parent.tw_maxTextWidth + parent.tw_maxShortcutTextWidth + 3).toFixed(2) + "em";
    },
                
    _setImageUrl: function(item, imageUrl) {
        imageUrl = tw_Component.expandUrl(imageUrl, true);
        
        if (item.className == "menuItem") {
            item.firstChild.childNodes.item(0).style.backgroundImage = imageUrl;
        } else {
            var s = item.firstChild.style; 
            s.backgroundImage = imageUrl;
            s.backgroundRepeat = "no-repeat";
            s.backgroundPosition = "center left";
            s.paddingLeft = imageUrl == "" ? "" : "18px";            
        }
    },
        
    _setKeyPressCombo: function(item, text) {
        if (item.className == "menuItem") {
            var textNode = item.firstChild.childNodes.item(2);        
            text = document.createTextNode(text);
    
            if (textNode.childNodes.length == 0) {
                textNode.appendChild(text);
            } else {
                textNode.replaceChild(text, textNode.firstChild);
            }
    
            this._calcEmWidth(item);
        } else {
            item.title = text;
        }
    },
    
    _getKeyPressCombo: function(item) {
        var textNode = item.firstChild.childNodes.item(2);
        return textNode.childNodes.length == 0 ? "" : textNode.firstChild.data;
    },
    
    _setArrowVisible: function(item, visible) {
        var b = item.firstChild;
        var img = "";
        if (visible) img = b.tw_invertArrow ? "url(?_twr_=menuArrowInvert.png)" : "url(?_twr_=menuArrow.png)";
        if (b.style.backgroundImage != img) b.style.backgroundImage = img;
    },    
    
    _open: function(item) {
        var content = item.lastChild;
        
        if (content.childNodes.length > 0) {                    
            if (item.className != "mainMenuItem") {
                var parent = item.parentNode;
                content.style.left = (parent.tw_maxTextWidth + parent.tw_maxShortcutTextWidth + 2.50) + "em";
            } else {
                content.style.zIndex = ++tw_Component.zIndex;            
            }
            
            content.style.visibility = "visible";
        }
    },

    _setHighlight: function(item, highlight) {        
        var button = item.firstChild;                
        
        if (item.className == "menuItem") {
            if (highlight) {
                button.tw_invertArrow = true;
                button.style.color = tw_COLOR_HIGHLIGHTTEXT;
                button.style.backgroundColor = tw_COLOR_HIGHLIGHT;
                if (this._activeMenuItem != null && this._fullIndex(item).indexOf(this._fullIndex(this._activeMenuItem)) != 0) this.close(this._activeMenuItem);
                this._activeMenuItem = item;
            } else {                
                button.tw_invertArrow = false;
                button.style.color = "";
                button.style.backgroundColor = "";
            }
            
            this._setArrowVisible(item, item.lastChild.childNodes.length > 0);
        } else {                
            if (this._activeMenuItem != null) {
                this._setHighlight(this._activeMenuItem, false);
                this._activeMenuItem = null;
            }

            if (highlight) {
                button.style.borderStyle = this._menusAreVisible ? "inset" : "outset"; 
                button.style.borderColor = tw_Component.getIEBorder(this._borderColor, "outset");
            } else {
                button.style.borderStyle = "solid";
                button.style.borderColor = this._backgroundColor;
            }
        }        
    },
   
    _setText: function(item, text) {
        var child = item.firstChild;
        child.tw_text = this._parseRichText(text);
        text = tw_Component.setRichText(text);

        if (item.className == "menuItem") {
            var textNode = child.childNodes.item(1); 

            if (textNode.childNodes.length == 0) {
                textNode.appendChild(text);
            } else {
                textNode.replaceChild(text, textNode.firstChild);
            }
                        
            this._calcEmWidth(item);
        } else {            
            if (child.childNodes.length == 0) {
                child.appendChild(text);
            } else {
                child.replaceChild(text, child.firstChild);
            }
        }
    },
    
    _parseRichText: function(text, sb) {
        if (!(text instanceof Object)) return text;
        if (sb == null) sb = [];
        for (n in text) {
            var node = text[n];
            if (node instanceof Object) {
                if (node.c != undefined) sb.push(this._parseRichText(node.c, sb));
            } else {
                sb.push(node);
            }
        }
        return sb.join("");
    },
    
    _getText: function(item) {
        return item.firstChild.tw_text;
    },
    
    _add: function(menu, index) {
        var prefix = menu.className == "mainMenu" ? "mainM" : "m";
    
        var item = document.createElement("div");
        item.className = prefix + "enuItem";
                                                
        var button = document.createElement("div");
        button.className = prefix + "enuButton";
                
        if (menu.className != "mainMenu") {
            var s = item.style;
            s.position = "relative";
            
            var s = button.style;
            s.position = "relative";
            s.padding = "2px";
            s.paddingRight = "18px";
            s.backgroundRepeat = "no-repeat";
            s.backgroundPosition = "center right";

            var image = document.createElement("div");
            image.className = "menuButtonImage";
            var s = image.style;
            s.height = "16px";
            s.width = "16px";
            s.backgroundRepeat = "no-repeat";
            s.backgroundPosition = "center center";
            button.appendChild(image);
    
            var text = document.createElement("span");
            text.className = "menuButtonText";
            var s = text.style;
            s.position = "absolute";
            s.top = "3px";
            s.left = "20px";            
            button.appendChild(text);
            
            var shortcutText = document.createElement("span");
            shortcutText.className = "menuButtonSText";
            var s = shortcutText.style;
            s.position = "absolute";
            s.top = "2px";
            s.right = "20px";
            button.appendChild(shortcutText);                    
            
            if (menu.className != "mainMenuItem") this._setArrowVisible(menu, true);
        } else {
            var s = item.style;
            s.styleFloat = "left";
            
            var s = button.style;
            s.whiteSpace = "nowrap";
            s.paddingTop = "2px";
            s.paddingBottom = "2px";
            s.borderWidth = "1px";
            s.borderStyle = "solid";
            s.borderColor = this._backgroundColor;
            s.paddingLeft = "5px";
            s.paddingRight = "5px";
            var lineHeight = this._height - this._mainItemSub;
            if (lineHeight < 0) lineHeight = 0;
            s.lineHeight = lineHeight + "px";
        }
    
        item.appendChild(button);
        
        var content = document.createElement("div");
        content.className = prefix + "enuContent";
        var s = content.style;        
        s.position = "absolute";
        s.visibility = "hidden";
        
        s.backgroundColor = this._backgroundColor;
        s.borderWidth = this._borderSize + "px";
        var borderType = this._borderType;
        s.borderStyle = borderType;
        s.borderColor = tw_Component.getIEBorder(this._borderColor, borderType);

        if (prefix == "m") s.top = "-2px";        
        content.tw_maxTextWidth = 0;
        content.tw_maxShortcutTextWidth = 0;
        item.appendChild(content);
    
        var parent;
    
        if (menu.className == "mainMenu") {
            parent = menu;            
            tw_addEventListener(item, "mouseover", this._mainMenuMouseOver); 
            tw_addEventListener(item, "mousedown", this._mainMenuMouseDown);
            tw_addEventListener(item, "mouseout", this._mainMenuMouseOut);
            tw_addEventListener(item, "click", this._mainMenuClick);            
        } else {
            parent = menu.lastChild;                        
            tw_addEventListener(item, "mouseover", this._itemMouseOver); 
            tw_addEventListener(item, "click", this._itemClick);
        }
    
        if (index == -1) {
            parent.appendChild(item);
        } else if (index >= parent.childNodes.length) {
            parent.appendChild(item);
        } else {
            var before = parent.childNodes.item(index);
            parent.insertBefore(item, before);
        }
    
        return item;
    },    
            
    _remove: function(menu, index) {
        var parent = menu.className == "mainMenu" ? menu : menu.lastChild;
        var nodes = parent.childNodes;
        var item = nodes.item(index);
        parent.removeChild(item);
    
        if (menu.className != "mainMenu") {                
            parent.tw_maxTextWidth = 0;
            parent.tw_maxShortcutTextWidth = 0;
            nodes = parent.childNodes;
            
            if (nodes.length > 0) {                    
                for (var i = nodes.length - 1; i >= 0; i--) {
                    var item = nodes.item(i);                
                    if (item.className != "menuDivider") this._calcEmWidth(item);
                }
            } else if (menu.className != "mainMenuItem")
                this._setArrowVisible(menu, false);                    
        }
    },
    
    itemRemove: function(value) {
        var idx = value.lastIndexOf(".");
        
        if (idx < 0) {
            this._remove(this._box, value);
        } else {
            var item = this._fullIndexItem(value.slice(0, idx));
            item._remove(item, value.slice(idx + 1));
        }
    },
    
    _addDivider: function(menu, index) {
        var item = document.createElement("div");
        item.className = "menuDivider";
        var s = item.style;
        s.marginTop = "3px";
        s.marginBottom = "3px";
        s.marginLeft = "2px";
        s.marginRight = "1px";
        
        var borderSize = this._borderSize / 2;        
        s.borderTopWidth = Math.floor(borderSize) + "px";
        s.borderRightWidth = s.borderLeftWidth = "0px";
        s.borderBottomWidth = (borderSize < 1 ? 1 : Math.floor(borderSize)) + "px";
        var borderStyle = this._getReverseBorderStyle(this._borderType);
        s.borderStyle = borderStyle;
        s.borderColor = tw_Component.getIEBorder(this._borderColor, borderStyle);
        
        var parent = menu.lastChild;
        
        if (index == -1) {
            parent.appendChild(item);
        } else if (index >= parent.childNodes.length) {
            parent.appendChild(item);
        } else {
            var before = parent.childNodes.item(index);
            parent.insertBefore(item, before);
        }
        
        return item;
    },           
        
    _load: function(menu, data) {
        if (data instanceof Array) {
            for (var i = 0, cnt = data.length; i < cnt; i++)
                this._load(menu, data[i]);        
        } else {
            var index = data.x == undefined ? -1 : data.x;
            
            if (data.t == undefined) {
                this._addDivider(menu, index);
            } else {
                var item = this._add(menu, index);
                this._setText(item, data.t);
                if (data.g != undefined) this._setImageUrl(item, data.g);        
                if (data.k != undefined) this._setKeyPressCombo(item, data.k);
                if (data.d != undefined) item.disabled = true;
                
                if (data.c != undefined) {
                    for (var i = 0, cnt = data.c.length; i < cnt; i++) {
                        this._load(item, data.c[i]);
                    }
                }                
    
                if (data.en == false) item.disabled = true;
            }
        }
    },
    
    _getIndex: function(node) {
        var index = 0;
        while ((node = node.previousSibling) != null)
            index++;
        return index;
    },
    
    _fullIndex: function(item) {        
        var index = this._getIndex(item);
        var value = index;            
        
        while (item.className != "mainMenuItem" ) {
            item = item.parentNode.parentNode;
            var index = this._getIndex(item);
            var value = index + "." + value;
        }
        
        return value;
    },    
    
    _fullIndexItem: function(findex) {
        if (findex == "rootItem") return this._box;
        
        var ary = findex.split(".");
        var value = parseInt(ary[0]);
        var node = this._box.childNodes.item(value);
        
        for (var i = 1; i < ary.length; i++) {
            pnode = node.childNodes.item(1);
            value = parseInt(ary[i]);
            node = pnode.childNodes.item(value);
        }
        
        return node;
    },
        
    itemLoad: function(data, itemPos) {
        var item = this._fullIndexItem(itemPos);
        this._load(item, data);
    },
        
    itemSetText: function(itemPos, text) {
        var item = this._fullIndexItem(itemPos);
        this._setText(item, text);
    },
    
    itemSetKeyPressCombo: function(itemPos, keyPressCombo) {
        if (item.className == "menuItem") {
            var item = this._fullIndexItem(itemPos);
            this._setKeyPressCombo(item, text);
        }
    },
    
    itemSetEnabled: function(itemPos, enabled) {
        var item = this._fullIndexItem(itemPos);
        item.disabled = !enabled;
    },

    itemSetImageUrl: function(itemPos, image) {
        if (item.className == "menuItem") {
            var item = this._fullIndexItem(itemPos);
            this._setImageUrl(item, image);
        }
    },
    
    clear: function(menu) {
        var content = menu.className == "mainMenu" ? menu : menu.lastChild;
        var nodes = content.childNodes;
        
        for (var i = nodes.length - 1; i >= 0; i--) {
            var item = nodes.item(i);
            if (item.className != "menuDivider") this._clear(item);
            this._remove(menu, i);
        }
    },
    
    close: function(menu) {
        if (menu == null) menu = this._box;
        
        if (menu.className == "mainMenu") {
            if (!this._menusAreVisible) return;                
            var nodes = menu.childNodes;
            
            for (var i = nodes.length; --i >= 0;) {
                var item = nodes.item(i); 
                this.close(item);
                this._setHighlight(item, false);
            }
            
            this._menusAreVisible = false;
        } else {
            var content = menu.lastChild;
            var nodes = content.childNodes;            
            content.style.visibility = "hidden";
            
            for (var i = nodes.length; --i >= 0;) {
                var item = nodes.item(i);
                if (item.className == "menuDivider") continue;
                
                if (item.lastChild.style.visibility != "hidden") {
                    this.close(item);
                    this._setHighlight(item, false);
                }
            }

            this._setHighlight(menu, false);
        }
    },
    
    destroy: function() {
        this._activeMenuItem = null;
        arguments.callee.$.call(this);        
    }
});
