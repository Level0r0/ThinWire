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
package thinwire.render.web;

import java.util.HashMap;
import java.util.Map;

import thinwire.ui.Component;
import thinwire.ui.Frame;
import thinwire.ui.Menu;
import thinwire.ui.Window;
import thinwire.ui.event.PropertyChangeEvent;

/**
 * @author Joshua J. Gertzen
 */
class WindowRenderer extends ContainerRenderer {
    private static final String SET_TITLE = "setTitle";
    private static final String SET_MENU = "setMenu";            

    private Map<Component, Integer> compToId;
    private MenuRenderer mr;
    WebApplication ai;
    int[] compBounds;
    
    void render(WindowRenderer wr, Component c, ComponentRenderer container) {
        setPropertyChangeIgnored(Component.PROPERTY_VISIBLE, true);
        Window w = (Window)c;
        if (!(w instanceof Frame)) {
            addInitProperty(Window.PROPERTY_TITLE, RICH_TEXT_PARSER.parseRichText(w.getTitle(), this));
        } else {
            addInitProperty(Window.PROPERTY_TITLE, w.getTitle());
        }
        compToId = new HashMap<Component, Integer>(w.getChildren().size());
        compBounds = new int[4];
        super.render(wr, c, container);
        Menu m = w.getMenu();
        if (m != null) (mr = (MenuRenderer)ai.getRenderer(m)).render(wr, m, this);
    }
    
    void destroy() {
        ai.clientSideMethodCall(id, DESTROY);
        if (mr != null) mr.destroy();
        super.destroy();
        mr = null;
        ai = null;
        compToId.clear();
        compToId = null;
        compBounds = null;
    }
    
    Integer getComponentId(Component comp) {
        return compToId.get(comp);
    }
    
    Integer addComponentId(Component comp) {
        Integer id = ai.getNextComponentId();
        compToId.put(comp, id);
        return id;
    }

    Integer removeComponentId(Component comp) {
        return compToId.remove(comp);
    }
    
    public void propertyChange(PropertyChangeEvent pce) {        
        String name = pce.getPropertyName();
        if (isPropertyChangeIgnored(name)) return;
        super.propertyChange(pce);
        Object newValue = pce.getNewValue();        

        if (name.equals(Window.PROPERTY_TITLE)) {
            postClientEvent(SET_TITLE, newValue);
        } else if (name.equals(Window.PROPERTY_MENU)) {
            if (mr != null) mr.destroy();            
            
            if (newValue == null) {
                mr = null;
                postClientEvent(SET_MENU, newValue);                
            } else {
                Menu m = (Menu)newValue;
                (mr = (MenuRenderer)ai.getRenderer(m)).render(wr, m, this);            
            }
        }
    }
}
