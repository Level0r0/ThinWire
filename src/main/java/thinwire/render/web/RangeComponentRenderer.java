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
import thinwire.ui.RangeComponent;
import thinwire.ui.event.PropertyChangeEvent;
import thinwire.ui.style.FX;

abstract class RangeComponentRenderer extends ComponentRenderer {
    
    public void render(WindowRenderer wr, Component c, ComponentRenderer container) {
        RangeComponent rc = (RangeComponent) c;
        if (rc.getLength() == 1) {
            addInitProperty(RangeComponent.PROPERTY_LENGTH, 2);
            addInitProperty(RangeComponent.PROPERTY_CURRENT_INDEX, rc.getCurrentIndex() + 1);
        } else {
            addInitProperty(RangeComponent.PROPERTY_LENGTH, rc.getLength());
            addInitProperty(RangeComponent.PROPERTY_CURRENT_INDEX, rc.getCurrentIndex());
        }
        
        super.render(wr, comp, container);
    }
    
    public void propertyChange(PropertyChangeEvent pce) {
        String name = pce.getPropertyName();
        if (isPropertyChangeIgnored(name)) return;
        Object newValue = pce.getNewValue();
        RangeComponent rc = (RangeComponent) comp;
        
        if (name.equals(RangeComponent.PROPERTY_LENGTH)) {
            if (rc.getLength() == 1) {
                postClientEvent("setLength", 2);
                postClientEvent("setCurrentIndex", rc.getCurrentIndex() + 1);
            } else {
                postClientEvent("setLength", (Integer) newValue);
                postClientEvent("setCurrentIndex", rc.getCurrentIndex());
            }
        } else if (name.equals(RangeComponent.PROPERTY_CURRENT_INDEX)) {
            if (rc.getLength() == 1) {
                setPropertyWithEffect(name, ((Integer) newValue + 1), ((Integer) pce.getOldValue() + 1), "setCurrentIndex", FX.PROPERTY_FX_POSITION_CHANGE);
            } else {
                setPropertyWithEffect(name, (Integer) newValue, (Integer) pce.getOldValue(), "setCurrentIndex", FX.PROPERTY_FX_POSITION_CHANGE);
            }
        } else {
            super.propertyChange(pce);
        }
    }

}
