# Setting Up in a Canvas App

To integrate this component into a Canvas App, follow these steps:

1. **Insert the Component**: 
   - Add the `indexDB1` component as a `CodeComponent`.
   - Set its `ComponentName` to `indexDB1`.
2. **Define Component Properties**:
   - Bind `colName`, `colData`, and `writeAction` to context variables: ctx_indexDB_colName, ctx_indexDB_colData, and ctx_indexDB_writeAction.
   - Example:
     ```yaml
      - indexDB1:
        Control: CodeComponent
        ComponentName: belleye_Belleye.indexDB
        Properties:
          OnChange: =UpdateContext({ctx_indexDB_writeAction:false,ctx_indexDB_colName:"*"})
          X: =1166
          colData: =ctx_indexDB_colData
          colName: =ctx_indexDB_colName
          writeAction: =ctx_indexDB_writeAction
     ```
3. **Create a Collection**:
     - Add a slider to set the number of records to create:
       ```yaml
       - Slider1:
          Control: Slider@1.0.31
          Properties:
            Max: =50
            Min: =1
            X: =246
            Y: =40
       ```
     - Use a button's `OnSelect` property to save data:
       ```yaml
       - btn_CreateData:
           Control: Button@0.0.44
           Properties:
             OnSelect: |+
               =Clear(col_demo);
               ForAll(
                   Sequence(Slider1.Value*1000, 1, 1),
                   Collect(col_demo, { rowID: ThisRecord.Value, Data: GUID(), Loaded:Now() })
               );
             Text: ="Create Collection"
             Width: =Parent.Width
             X: =54
             Y: =45
       ```
4. **Save Data to IndexedDB**:
   - Use a button's `OnSelect` property to save data:
     ```yaml
     - btn_SaveData:
         Control: Button@0.0.44
         Properties:
              OnSelect: =UpdateContext({ctx_indexDB_colName:"col_demo",ctx_indexDB_colData:JSON(col_demo),ctx_indexDB_writeAction:true})
              Text: "Save Collection"
        ```
5. **Display Data from IndexedDB**:
   - Bind a Gallery to `indexDB1.colDataOut` to display stored data:
     ```yaml
     - Gallery1:
          Control: Gallery@2.15.0
          Variant: BrowseLayout_Vertical_ThreeTextVariant_ver5.0
          Properties:
            Height: =568
            Items: "=If(\n    IsBlank(indexDB1.colDataOut),\n    Blank(),\n    AddColumns(\n        Table(ParseJSON(First(Filter(AddColumns(Table(ParseJSON(indexDB1.colDataOut)),colName,Text(Value.colName),colData,Text(Value.colData)),colName = \"col_demo\")).colData)),\n        \n        rowID, Text(Value.rowID),\n        Data, Text(Value.Data),\n        Loaded, Text(Value.Loaded)\n    )\n)"
            Width: =590
            Y: =200
          Children:
            - Title3:
                Control: Label@2.5.1
                Properties:
                  BorderColor: =RGBA(0, 0, 0, 1)
                  Color: =RGBA(50, 49, 48, 1)
                  FontWeight: =If(ThisItem.IsSelected, FontWeight.Semibold, FontWeight.Normal)
                  Height: =Self.Size * 1.8
                  OnSelect: =Select(Parent)
                  PaddingBottom: =0
                  PaddingLeft: =0
                  PaddingRight: =0
                  PaddingTop: =0
                  Size: =14
                  Text: =ThisItem.rowID
                  VerticalAlign: =VerticalAlign.Top
                  Width: =Parent.TemplateWidth - 86
                  X: =16
                  Y: =(Parent.TemplateHeight - (Self.Size*1.8 + Subtitle3.Size*1.8 + 2 + Body1.Size*1.8)) / 2
            - Subtitle3:
                Control: Label@2.5.1
                Properties:
                  BorderColor: =RGBA(0, 0, 0, 1)
                  FontWeight: =If(ThisItem.IsSelected, FontWeight.Semibold, FontWeight.Normal)
                  Height: =Self.Size * 1.8
                  OnSelect: =Select(Parent)
                  PaddingBottom: =0
                  PaddingLeft: =0
                  PaddingRight: =0
                  PaddingTop: =0
                  Size: =12
                  Text: =ThisItem.Data
                  VerticalAlign: =VerticalAlign.Top
                  Width: =Title3.Width
                  X: =Title3.X
                  Y: =Title3.Y + Title3.Height
            - Body1:
                Control: Label@2.5.1
                Properties:
                  BorderColor: =RGBA(0, 0, 0, 1)
                  FontWeight: =If(ThisItem.IsSelected, FontWeight.Semibold, FontWeight.Normal)
                  Height: =Self.Size * 1.8
                  OnSelect: =Select(Parent)
                  PaddingBottom: =0
                  PaddingLeft: =0
                  PaddingRight: =0
                  PaddingTop: =0
                  Size: =12
                  Text: =ThisItem.Loaded
                  VerticalAlign: =VerticalAlign.Top
                  Width: =Title3.Width
                  X: =Title3.X
                  Y: =Subtitle3.Y + Subtitle3.Height
            - NextArrow3:
                Control: Classic/Icon@2.5.0
                Properties:
                  AccessibleLabel: =Self.Tooltip
                  Color: =RGBA(166, 166, 166, 1)
                  Height: =50
                  Icon: =Icon.ChevronRight
                  OnSelect: =Select(Parent)
                  PaddingBottom: =16
                  PaddingLeft: =16
                  PaddingRight: =16
                  PaddingTop: =16
                  Tooltip: ="View item details"
                  Width: =50
                  X: =Parent.TemplateWidth - Self.Width - 12
                  Y: =(Parent.TemplateHeight / 2) - (Self.Height / 2)
            - Separator3:
                Control: Rectangle@2.3.0
                Properties:
                  Fill: =RGBA(255, 255, 255, 1)
                  Height: =8
                  OnSelect: =Select(Parent)
                  Width: =Parent.TemplateWidth
                  Y: =Parent.TemplateHeight - Self.Height
            - Rectangle3:
                Control: Rectangle@2.3.0
                Properties:
                  Fill: =App.Theme.Colors.Darker30
                  Height: =Parent.TemplateHeight - Separator3.Height
                  OnSelect: =Select(Parent)
                  Visible: =ThisItem.IsSelected
                  Width: =4
     ```
6. **Clear Data from IndexedDB**:
   - Use a button's `OnSelect` property to clear data:
     ```yaml
     - btn_ClearData:
         Control: Button@0.0.44
         Properties:
           OnSelect: =UpdateContext({ctx_indexDB_colName:"*",ctx_indexDB_colData:Blank(),ctx_indexDB_writeAction:true})
           Text: ="Clear Store"
           Width: =Parent.Width
           X: =54
           Y: =163
     ```
