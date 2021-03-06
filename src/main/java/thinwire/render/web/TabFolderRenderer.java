/*
ThinWire(R) Ajax RIA Framework
Copyright (C) 2003-2008 Custom Credit Systems

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
*/
package thinwire.render.web;

import thinwire.ui.Component;
import thinwire.ui.TabFolder;
import thinwire.ui.event.PropertyChangeEvent;

/**
 * @author Joshua J. Gertzen
 */
final class TabFolderRenderer extends ContainerRenderer {
    private static final String TABFOLDER_CLASS = "tw_TabFolder";
    private static final String SET_CURRENT_INDEX = "setCurrentIndex";

    void render(WindowRenderer wr, Component c, ComponentRenderer container) {
        init(TABFOLDER_CLASS, wr, c, container);
        addClientSideProperty(TabFolder.PROPERTY_CURRENT_INDEX);        
        setPropertyChangeIgnored(TabFolder.PROPERTY_SCROLL_TYPE, true);
        super.render(wr, c, container);
        postClientEvent(SET_CURRENT_INDEX, new Integer(((TabFolder)c).getCurrentIndex()));        
	}

    public void propertyChange(PropertyChangeEvent pce) {        
        if (pce.getPropertyName().equals(TabFolder.PROPERTY_CURRENT_INDEX)) {
            if (isPropertyChangeIgnored(TabFolder.PROPERTY_CURRENT_INDEX)) return;        
            postClientEvent(SET_CURRENT_INDEX, pce.getNewValue());
        } else {
            super.propertyChange(pce);
        }
    }
    
    public void componentChange(WebComponentEvent event) {
        String name = event.getName();
        String value = (String)event.getValue();
        TabFolder tf = (TabFolder)comp;
        
        if (name.equals(TabFolder.PROPERTY_CURRENT_INDEX)) {
            setPropertyChangeIgnored(name, true);
            tf.setCurrentIndex(Integer.valueOf(value).intValue());
            setPropertyChangeIgnored(name, false);
        } else {
            super.componentChange(event);
        }
    }
}
