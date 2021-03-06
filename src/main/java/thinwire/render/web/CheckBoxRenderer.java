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

import thinwire.ui.CheckBox;
import thinwire.ui.Component;
import thinwire.ui.event.PropertyChangeEvent;

/**
 * @author Joshua J. Gertzen
 */
final class CheckBoxRenderer extends TextComponentRenderer {
    private static final String CHECKBOX_CLASS = "tw_CheckBox";
    private static final String SET_CHECKED = "setChecked";

    void render(WindowRenderer wr, Component c, ComponentRenderer container) {
        init(CHECKBOX_CLASS, wr, c, container);
        CheckBox cb = (CheckBox)c;
        addClientSideProperty(CheckBox.PROPERTY_CHECKED);
        addInitProperty(CheckBox.PROPERTY_CHECKED, cb.isChecked());
        super.render(wr, c, container);
	}
    
    public void propertyChange(PropertyChangeEvent pce) {
        String name = pce.getPropertyName();
        if (isPropertyChangeIgnored(name)) return;
        Object newValue = pce.getNewValue();        

        if (name.equals(CheckBox.PROPERTY_CHECKED)) {
            postClientEvent(SET_CHECKED, newValue);
        } else {
            super.propertyChange(pce);           
        }
    }
    
    public void componentChange(WebComponentEvent event) {
        String name = event.getName();
        String value = (String)event.getValue();
        CheckBox cb = (CheckBox)comp;
        
        if (name.equals(CheckBox.PROPERTY_CHECKED)) {
            setPropertyChangeIgnored(CheckBox.PROPERTY_CHECKED, true);
            cb.setChecked(Boolean.valueOf(value).booleanValue());
            setPropertyChangeIgnored(CheckBox.PROPERTY_CHECKED, false);
        } else {
            super.componentChange(event);
        }
    }    
}
