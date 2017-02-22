
function XMLWriter( encoding, version ){
	if( encoding )
		this.encoding = encoding;
	if( version )
		this.version = version;
};

(function(){
	
XMLWriter.prototype = {
	encoding:'UTF-8',// what is the encoding
	version:'1.0', //what xml version to use
	formatting: 'indented', //how to format the output (indented/none)  ?
	indentChar:'\t', //char to use for indent
	indentation: 1, //how many indentChar to add per level
	newLine: '\n', //character to separate nodes when formatting
	//start a new document, cleanup if we are reusing
	writeStartDocument:function( standalone ){
		this.close();//cleanup
		this.stack = [ ];
		this.standalone = standalone;
	},
	//get back to the root
	writeEndDocument:function(){
		this.active = this.root;
		this.stack = [ ];
	},
	//set the text of the doctype
	writeDocType:function( dt ){
		this.doctype = dt;
	},
	//start a new node with this name, and an optional namespace
	writeStartElement:function( name, ns ){
		if( ns )//namespace
			name = ns + ':' + name;
		
		var node = { n:name, a:{ }, c: [ ] };//(n)ame, (a)ttributes, (c)hildren
		
		if( this.active ){
			this.active.c.push(node);
			this.stack.push(this.active);
		}else
			this.root = node;
		this.active = node;
	},
	//go up one node, if we are in the root, ignore it
	writeEndElement:function(){
		this.active = this.stack.pop() || this.root;
	},
	//add an attribute to the active node
	writeAttributeString:function( name, value ){
		if( this.active )
			this.active.a[name] = value;
	},
	//add a text node to the active node
	writeString:function( text ){
		if( this.active )
			this.active.c.push(text);
	},
	//shortcut, open an element, write the text and close
	writeElementString:function( name, text, ns ){
		this.writeStartElement( name, ns );
		this.writeString( text );
		this.writeEndElement();
	},
	//add a text node wrapped with CDATA
	writeCDATA:function( text ){
		this.writeString( '