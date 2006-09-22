/*
 #LICENSE_HEADER#
 #VERSION_HEADER#
 */
package thinwire.ui.style;

/**
 * @author Joshua J. Gertzen
 */
public class Style {  
    private static final Style DEFAULT_STYLE;
    static {
        Style s = new Style();
        Font f = s.getFont();
        f.setFamily(Font.Family.SANS_SERIF);
        f.setColor(Color.BLACK);
        f.setItalic(false);
        f.setBold(false);
        f.setUnderline(false);
        f.setSize(8);
        
        s.getBackground().setColor(Color.WHITE);

        Border b = s.getBorder();
        b.setColor(Color.WHITE);
        b.setSize(0);
        b.setType(Border.Type.NONE);
        
        FX fx = s.getFX();
        fx.setPositionChange(FX.Type.NONE);
        fx.setSizeChange(FX.Type.NONE);
        fx.setVisibleChange(FX.Type.NONE);
        
        DEFAULT_STYLE = s;
    }
    
    private Object parent;
    private Font font;
    private Background background;
    private Border border;
    private FX fx;
    Style defaultStyle;
    
    public Style() {
        this(null, null);
    }
    
    public Style(Style defaultStyle) {
       this(defaultStyle, null); 
    }
    
    protected Style(Style defaultStyle, Object parent) {
        this.parent = parent;
        
        if (defaultStyle == null) {
            this.defaultStyle = DEFAULT_STYLE;        
        } else {
            this.defaultStyle = new Style();
            this.defaultStyle.copy(defaultStyle);
        }
        
        this.font = new Font(this);
        this.background = new Background(this);
        this.border = new Border(this);
        this.fx = new FX(this);
        if (this.defaultStyle != null) this.copy(this.defaultStyle);
    }

    //NOTE: This is overridden by Component so it can receive these property change notifications
    protected void firePropertyChange(Object source, String propertyName, Object oldValue, Object newValue) {
        
    }
        
    public void copy(Style style) {
        copy(style, false);
    }

    public void copy(Style style, boolean onlyIfDefault) {
        if (style == null) throw new IllegalArgumentException("style == null");
        getFont().copy(style.getFont(), onlyIfDefault);
        getBackground().copy(style.getBackground(), onlyIfDefault);
        getBorder().copy(style.getBorder(), onlyIfDefault);
        getFX().copy(style.getFX());        
    }
    
    public Object getParent() {
        return parent;
    }
    
    public Font getFont() {
        return font;
    }
    
    public Background getBackground() {
        return background;
    }
    
    public Border getBorder() {
        return border;
    }               
    
    public FX getFX() {
        return fx;
    }               
}