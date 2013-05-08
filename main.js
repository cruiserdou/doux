/**
 * 返回系统主页
 */
function exitSys(){
  document.location='/WaterRM/index.jsp';
}

function Map(){
    this.elements = new Array();
  
    //获取MAP元素个数
    this.size = function() {
        return this.elements.length;
    };
  
    //判断MAP是否为空
    this.isEmpty = function() {
        return(this.elements.length < 1);
    };
  
    //删除MAP所有元素
    this.clear = function() {
        this.elements = new Array();
    };
  
    //向MAP中增加元素（key, value) 
    this.put = function(_key, _value) {
        this.elements.push( {
            key : _key,
            value : _value
        });
    };
  
    //删除指定KEY的元素，成功返回True，失败返回False
    this.remove = function(_key) {
        varbln = false;
        try{
            for(var i = 0; i < this.elements.length; i++) {
                if(this.elements[i].key == _key) {
                    this.elements.splice(i, 1);
                    return true;
                }
            }
        } catch(e) {
            bln = false;
        }
        return bln;
    };
  
    //获取指定KEY的元素值VALUE，失败返回NULL
    this.get = function(_key) {
        try{
            for(var i = 0; i < this.elements.length; i++) {
                if(this.elements[i].key == _key) {
                    return this.elements[i].value;
                }
            }
        } catch(e) {
            return null;
        }
    };
  
    //获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
    this.element = function(_index) {
        if(_index < 0 || _index >= this.elements.length) {
            return null;
        }
        return this.elements[_index];
    };
  
    //判断MAP中是否含有指定KEY的元素
    this.containsKey = function(_key) {
        varbln = false;
        try{
            for(var i = 0; i < this.elements.length; i++) {
                if(this.elements[i].key == _key) {
                    bln = true;
                }
            }
        } catch(e) {
            bln = false;
        }
        return bln;
    };
  
    //判断MAP中是否含有指定VALUE的元素
    this.containsValue = function(_value) {
        varbln = false;
        try{
            for(var i = 0; i < this.elements.length; i++) {
                if(this.elements[i].value == _value) {
                    bln = true;
                }
            }
        } catch(e) {
            bln = false;
        }
        return bln;
    };
  
    //获取MAP中所有VALUE的数组（ARRAY）
    this.values = function() {
        vararr = new Array();
        for(var i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].value);
        }
        return arr;
    };
  
    //获取MAP中所有KEY的数组（ARRAY）
    this.keys = function() {
        vararr = new Array();
        for(var i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].key);
        }
        return arr;
    };
}
Ext.chart.Chart.CHART_URL = 'http://www.giscloud.org/jslib/ext-3/resources/charts.swf';
Ext.onReady(function() {
	Ext.BLANK_IMAGE_URL = 'images/s.gif';
	Ext.QuickTips.init();
	Ext.form.Field.prototype.msgTarget = 'side';
	//布局管理
	new Ext.Viewport({
		layout : 'border',
		items : [panel_func,tabPanel]
	});
	//设置系统主题
	Ext.util.CSS.swapStyleSheet("theme", "http://www.giscloud.org/jslib/ext-3/resources/css/xtheme-gray.css");
});

function Print(file, mapT){
	var wrd = new ActiveXObject("Word.Application");
	wrd.Documents.Open(file);
	for (var i = 0; i < mapT.size(); i++)
		wrd.ActiveDocument.Bookmarks(mapT.element(i).key).Range.InsertBefore(mapT.element(i).value);
	wrd.Application.Visible = true;
}

function ExportExcel(store, map){
	try {
		var xls = new ActiveXObject("Excel.Application");
	} catch (e) {
		alert("要打印该表，您必须安装Excel电子表格软件，同时浏览器须使用“ActiveX 控件”，您的浏览器须允许执行控件。 请点击【帮助】了解浏览器设置方法！");
 		return "";
	}
	
	var xlBook = xls.Workbooks.Add;
	var xlsheet = xlBook.Worksheets(1);
	
	//设置标题栏
	for (var j = 0; j < map.size(); j++){
		xlsheet.Cells(1, j + 1).Value = map.element(j).value;
	}
	
	xls.visible = true;
	
	for (var j = 0; j < map.size(); j++){
		for (var i = 0; i < store.getCount(); i++)
			xlsheet.Cells(i + 2, j + 1).Value = store.getAt(i).get(map.element(j).key);
	}
	
	xls.UserControl = true;
	xls = null;
	xlBook = null;
	xlsheet = null;
}

