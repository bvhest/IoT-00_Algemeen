function displaysearch()
{
var currentsvalue=jQuery("#search").val();
var searchtext=currentsvalue.trim(); 
jQuery("#search").val(searchtext);
var currentmbvalue=jQuery("#searchmob").val();
var searchmbtext=currentmbvalue.trim(); 
jQuery("#searchmob").val(searchmbtext);
if((currentsvalue == '') || (currentsvalue == 'search'))
{
jQuery("#search").val('**');
}
}
jQuery(document).ready(function (e) {
jQuery(document).keyup(function(event) {
    if(event.which === 27) {
        jQuery('#sbs_search_autocomplete_box').hide();
    }
});});
var SolrBridgeSearch = function(el, options){
    this.el = $(el);
    this.id = this.el.identify();
    this.el.setAttribute('autocomplete','off');
    this.responseData = [];
    this.ajaxBaseUrl = null;
    this.queryFields = null;  
    this.SolrBridgeSearchmessage = null;
    this.Searchlinks = null;
    this.timestamp = 0;
    this.data = [];
    this.badQueries = [];
    this.selectedIndex = -1;
    this.selectedItemIndex = 0;
    this.selectedProductId = null;
    this.currentValue = this.el.value;
    this.currentKeyword = null;
    this.intervalId = 0;
    this.cachedResponse = [];
    this.itemCount = 0;
    this.action = false;
    this.instanceId = null;
    this.onChangeInterval = null;
    this.ignoreValueChange = false;
    this.serviceUrl = options.serviceUrl;
    this.options = {
        autoSubmit:false,
        minChars:1,
        maxHeight:300,
        deferRequestBy: 500,
        width:0,
        container:null,
        allowFilter:0,
        currencySign: '$',
        displayThumb:0
    };
    if (options) {
        Object.extend(this.options, options);
    }
    if(SolrBridgeSearch.isDomLoaded) {
        this.initialize();
    } else {
        Event.observe(document, 'dom:loaded', this.initialize.bind(this), false);
    }
};

SolrBridgeSearch.instances = [];
SolrBridgeSearch.isDomLoaded = false;

SolrBridgeSearch.getInstance = function(id) {
    var instances = SolrBridgeSearch.instances;
    var i = instances.length;
    while(i--){ if(instances[i].id === id){ return instances[i]; }}
};

SolrBridgeSearch.highlight = function(value, re) {
    value = value.toString();
    return value.replace(re, function(match){ return '<strong>' + match + '<\/strong>' });
};

SolrBridgeSearch.prototype = {
    killerFn: null,
    initialize: function() {
    var me = this;
    this.killerFn = function(e) {
        if (!$(Event.element(e)).up('.autocomplete')) {
            me.killSuggestions();
            me.disableKillerFn();
          }
    }.bindAsEventListener(this);

    if (!this.options.width) { this.options.width = this.el.getWidth(); }
    
    //Create a div element
    this.box = new Element('div', { style: 'position:absolute;display:none;z-index:99999' });
    //Put some children div into parent div
    var divInner = new Element('div', {id: 'sbs_'+this.id+'_autocomplete_box'}).addClassName('sbs_autocomplete_inner');
    var divInnerRight = new Element('div', {id: 'sbs_'+this.id+'_autocomplete_right'}).addClassName('sbs_autocomplete_inner_right');
    divInner.appendChild(divInnerRight);
    
    var divInnerLeft = new Element('div', {id: 'sbs_'+this.id+'_autocomplete_left'}).addClassName('sbs_autocomplete_inner_left');
    divInner.appendChild(divInnerLeft);
    
    var divCloseButton = new Element('div', {id: 'sbs_'+this.id+'_closed_button'}).addClassName('sbs_autocomplete_close_button').update('&nbsp;');
    divInner.appendChild(divCloseButton);
    
    this.box.appendChild(divInner);
    
    //Append all div to body tag
    this.options.container = $(this.options.container);
    document.body.appendChild(this.box);
    
    //Get the div ID
    this.divId = this.box.identify();
    this.rightSideBar = $('sbs_'+this.id+'_autocomplete_right');
    this.container = $('sbs_'+this.id+'_autocomplete_box');
    this.closebutton = $('sbs_'+this.id+'_closed_button');
    this.leftSideBar = $('sbs_'+this.id+'_autocomplete_left');
    
    if (this.options.sideBarWidth) { this.leftSideBar.setStyle({width:'100%'}); }
    if (this.options.boxWidth) { this.container.setStyle({width:(this.options.boxWidth)+'px'}); }
    this.container.setStyle({padding:'0'});
    
    if (this.options.allowFilter == 1) {
        this.leftSideBar.show();
    } else {
        this.leftSideBar.remove();
    }
    
    //This function called to set some css attributes to the parent div
    this.fixPosition();
    
    Event.observe(this.el, window.opera ? 'keypress':'keydown', this.onKeyPress.bind(this));
    Event.observe(this.el, 'keyup', this.onKeyUp.bind(this));
    Event.observe(this.el, 'click', this.onClick.bind(this));
    Event.observe(this.el, 'blur', this.enableKillerFn.bind(this));
    Event.observe(this.el, 'focus', this.fixPosition.bind(this));
    Event.observe(this.closebutton, 'click', this.closeAll.bind(this));
    Event.observe(window, "resize", this.fixPosition.bind(this));
    this.instanceId = SolrBridgeSearch.instances.push(this) - 1;
  },
  closeAll: function() {
    this.hide();
  },
  hide: function() {
      this.box.hide();
  },
  show: function() {
      this.fixPosition();
      this.box.show();
  },
  fixPosition: function() {
    var offset = this.el.cumulativeOffset();
    var top = offset.top + this.el.getHeight();
    
    var windowSize = document.viewport.getDimensions();
    var windowWidth = windowSize.width;
    
    var boxWidth = this.el.getWidth();
    
    if (parseInt(this.options.boxWidth) > 0 && parseInt(windowWidth) >= parseInt(this.options.boxWidth)) {
        boxWidth = this.options.boxWidth;
        var left = offset.left - parseInt(this.options.boxWidth) + this.el.getWidth();
    }else{
        boxWidth = this.el.getWidth();
        var left = offset.left;
    }
    var x = windowWidth - boxWidth;

    if(x < 0) {
        boxWidth = this.el.getWidth();
        var left = offset.left;
    }
    this.container.setStyle({width:(boxWidth)+'px'});
    $(this.box).setStyle({ top: (top) + 'px', left: (left) + 'px' });
    this.closebutton.setStyle({ top: '5px', left: (boxWidth - 25)+ 'px' });
  },

  enableKillerFn: function() {
    Event.observe(document.body, 'click', this.killerFn);
  },

  disableKillerFn: function() {
    Event.stopObserving(document.body, 'click', this.killerFn);
  },

  killSuggestions: function() {
    this.stopKillSuggestions();
    this.intervalId = window.setInterval(function() { this.hide(); this.stopKillSuggestions(); } .bind(this), 1);
  },

  stopKillSuggestions: function() {
    window.clearInterval(this.intervalId);
  },
  onKeyPress: function(e) {
    if (!this.enabled) { return; }
    // return will exit the function
    // and event will not fire
    switch (e.keyCode) {
      case Event.KEY_ESC:
        this.el.value = this.currentValue;
        this.hide();
        break;
      case Event.KEY_TAB:
      case Event.KEY_RETURN:
          if (this.selectedIndex === -1) {
          this.hide();
          return;
        }
        this.enterSelect(this.selectedItemIndex);
        if (e.keyCode === Event.KEY_TAB) { return; }
        break;
      case Event.KEY_UP:
        this.moveUp();
        break;
      case Event.KEY_DOWN:
        this.moveDown();
        break;
      default:
        return;
    }
    Event.stop(e);
  },

  onKeyUp: function(e) {
    switch (e.keyCode) {
      case Event.KEY_UP:
      case Event.KEY_DOWN:
        return;
    }
    clearInterval(this.onChangeInterval);
    if (this.currentValue !== this.el.value) {
      if (this.options.deferRequestBy > 0) {
        // Defer lookup in case when value changes very quickly:
        this.onChangeInterval = setInterval((function() {
          this.onValueChange();
        }).bind(this), this.options.deferRequestBy);
      } else {
        this.onValueChange();
      }
    }
  },

  onValueChange: function() {
    clearInterval(this.onChangeInterval);
    this.currentValue = this.el.value;
    this.selectedIndex = -1;
    if (this.ignoreValueChange) {
      this.ignoreValueChange = false;
      return;
    }
    this.suggestions = [];
    if (this.currentValue === '' || this.currentValue.length < this.options.minChars) {
        this.hide();
    } else {
        this.getSuggestions();
    }
  },
  onClick: function(){
      this.suggestions = [];
      if (this.currentValue === '' || this.currentValue.length < this.options.minChars) {
            this.hide();
        } else {
            this.getSuggestions();
        }
  },
    getSuggestions: function() {
		 jQuery('#sbs_search_autocomplete_box').show();
        if(this.currentValue == this.options.searchTextPlaceHolder) {
            return false;
        }
        var timestamp = new Date().getTime();
        var requestParams = {
            'q':this.currentValue,
            'storeid':this.options.storeid,
            'customergroupid':this.options.customergroupid,
            'storetimestamp':this.options.storetimestamp,
            'currencycode':this.options.currencycode,
            'timestamp': timestamp
        };
        this.timestamp = timestamp;
        this.doRequest(this.options.ajaxBaseUrl+'/shared/sb.php',requestParams);
    },
    doRequest: function(url,params) {
        var me = this;
        var ajaxRequest = new Ajax.Request(url, {
            method:'get',
            evalJSON:'force',
            parameters: params,
            loaderArea: false,
            onSuccess: function(transport){
                //Error occur
                if(transport.responseJSON === undefined) {
                    return;
                }
                me.processResponse(transport.responseJSON);
            }
        });
    },
    isBadQuery: function(q) {
        var i = this.badQueries.length;
        while (i--) {
            if (q.indexOf(this.badQueries[i]) === 0) { return true; }
        }
        return false;
    },
    formatPrice: function(price) {
        var formattedPrice = price;
        if ((price !== undefined) && (price !== null)) {
            if(this.options.currencyPos == 'before'){
                formattedPrice = this.options.currencySign+price;
            } else {
                formattedPrice = price+this.options.currencySign;
            }
        } else {
            formattedPrice = '&nbsp;';
        }
        return formattedPrice;
    },
    _loadAjaxPrice: function() {
        //Load AJAX prices
        var me = this;
        if( undefined != this.options.ajaxprice && this.options.ajaxprice > 0 ) {
            
            if( undefined !== this.responseData.result ) {
                if( undefined !== this.responseData.result.product ) {
                    var productIds = [];
                    for(var index in this.responseData.result.product) {
                        if(!isNaN(index)) {
                            var productData = this.responseData.result.product[index];
                            productIds.push(productData.products_id);
                        }
                    }
                    
                    var url = this.options.searchResultUrl+'/ajax/prices?ids='+productIds.join(',');
                    var ajaxRequest = new Ajax.Request(url, {
                        method:'get',
                        evalJSON:'force',
                        parameters: {},
                        loaderArea: false,
                        onSuccess: function(transport){
                            //Error occur
                            if(transport.responseJSON === undefined) {
                                alert(transport.responseText);
                                return;
                            }
                            Object.keys(transport.responseJSON).each(function(k){
                                var item = transport.responseJSON[k];
                                $('sbs_search_regular_price_'+k).update(me.formatPrice(item.price));
                                if(parseInt(item.can_show_special_price) > 0) {
                                    if(document.getElementById('sbs_search_special_price_'+k)){
                                        $('sbs_search_special_price_'+k).update(me.formatPrice(item.special_price));
                                    }
                                } else {
                                    if(document.getElementById('sbs_search_special_price_'+k)){
                                        $('sbs_search_special_price_'+k).next().remove();
                                        $('sbs_search_special_price_'+k).remove();
                                    }
                                    var parent = $('sbs_search_regular_price_'+k).removeClassName('old-price').up();
                                    $(parent).removeClassName('origin');
                                }
                            });
                        }
                    });
                }
            }
        }
    },
    _getProductItem: function(index, productData){
        var value = productData.name_varchar;
        var elementId = 'sbs_'+this.id+'_product_index_'+index;
        var elementClassName = 'product suggested-item';
        var itemImage = '<div class="sbs_search_suggest_thumb"><img src="'+this.options.ajaxBaseUrl+'/media/catalog/product/sb_thumb/'+productData.products_id+'.jpg"/></div>';
        var itemTitle = '<span class="sbs_search_suggest_item_title">'+value+'</span>';
        var itemPrice = '';
        var price = productData.price_decimal;
        var specialPrice = productData.special_price_decimal;
        var formattedPrice = this.formatPrice(price);
        var formattedSpecialPrice = this.formatPrice(specialPrice);
        
        if(productData.product_type_static == 'bundle'){
            formattedPrice = this.options.fromPriceText+'&nbsp;'+formattedPrice;
            formattedSpecialPrice = this.options.fromPriceText+'&nbsp;'+formattedPrice;
        }
        
        //Load product prices by Ajax
        if( undefined != this.options.ajaxprice && this.options.ajaxprice > 0 ) {
            itemPrice = '<span class="origin"><span class="sbs_search_suggest_item_subtitle old-price" id="sbs_search_regular_price_'+productData.products_id+'"><img src="/js/solrsearch/ajax-loader.gif" /></span></span>';
            itemPrice += '<strong class="sbs_search_suggest_item_subtitle special" id="sbs_search_special_price_'+productData.products_id+'">&nbsp;</strong><br/>';
        } else {
            if (parseInt(specialPrice) > 0) {
                itemPrice = '<span class="sbs_search_suggest_item_subtitle old-price">'+formattedPrice+'</span>';
                itemPrice += '<span class="sbs_search_suggest_item_subtitle special-price">'+formattedSpecialPrice+'</span>';
            } else {
                itemPrice = '<span class="sbs_search_suggest_item_subtitle">'+formattedPrice+'</span>';
            }
        }
      //  var productUrl = this.options.searchResultUrl+'/ajax/product?productid='+productData.products_id+'&currency='+this.options.currencycode;
       var productUrl=productData.url_path_varchar;
	   var productalt = value.replace(/(<([^>]+)>)/ig,"");
		if(this.options.displayThumb == 1) {
		if(productData.favourite_varchar == 'Yes'){
		var productItem = new Element('a', {'id':elementId, 'title':productalt}).addClassName(elementClassName).update(itemImage+itemTitle+'<br/>'+itemPrice+'<br/>'+'<span class="search-fav"><img src="/js/solrsearch/fav-maker-tiny.png" title="Maker Favourite" alt="Maker Favourite" /></span>'); 
			 }
         else{
		var productItem = new Element('a', {'id':elementId, 'title':productalt}).addClassName(elementClassName).update(itemImage+itemTitle+'<br/>'+itemPrice+'<br/>');
		  }
            Event.observe(productItem, 'mouseout', this.onMouseOut.bind(this, productItem));
            Event.observe(productItem, 'mouseover', this.onMouseOver.bind(this, productItem));
        } else {
		if(productData.favourite_varchar == 'Yes')
		{
            var productItem = new Element('a', {'id':elementId, 'title':productalt}).addClassName(elementClassName).update(itemTitle+'<br/>'+itemPrice+'<br/>'+'<span class="search-fav"><img src="/js/solrsearch/fav-maker-tiny.png" title="Maker Favourite" alt="Maker Favourite" /></span>');
		}
		else{
		var productItem = new Element('a', {'id':elementId, 'title':productalt}).addClassName(elementClassName).update(itemTitle+'<br/>'+itemPrice+'<br/>');	
		}
			Event.observe(productItem, 'mouseout', this.onMouseOut.bind(this, productItem));
            Event.observe(productItem, 'mouseover', this.onMouseOver.bind(this, productItem));
        }
        $(productItem).setAttribute('href', productUrl);
        return productItem;
    },
    renderResult: function() {
        var me = this;
	this.Searchlinks=searchurllinks.links.split('%s').join(this.responseData.q);
        this.SolrBridgeSearchmessage = this.options.displayResultOfText.replace('%s', '<b>'+this.responseData.q+'</b>');
        if(this.responseData.q != this.currentValue.toLowerCase()){
            this.SolrBridgeSearchmessage = this.options.displayResultOfInsteadText.replace('%s', '<b>'+this.responseData.q+'</b>');
        }
        var suggestionMessage = this.SolrBridgeSearchmessage;
        var divider = '<div class="suggest_product_items suggest_divider sbs_autocomplete_message">'+suggestionMessage+'</div>';
	divider = '<div class="forum_suggest">'+this.Searchlinks+'</div>' + divider;
        this.rightSideBar.update(divider);
        
        //Render keywords
        if( undefined !== this.responseData.keywordssuggestions ) {
            for(var key_word in this.responseData.keywordssuggestions)
            {
                if(!isNaN(key_word)){
                    var keywordString = this.responseData.keywordssuggestions[key_word];
                    var keywordStringRaw = this.responseData.keywordsraw[key_word];
                    var keywordItem = new Element('a',{id:'sbs_'+this.id+'_keyword_index_'+key_word,onmouseover:'$(this).addClassName("selected")',onmouseout:'$(this).removeClassName("selected")'}).addClassName('keywords suggested-item');
                    var itemUrl = this.options.searchResultUrl+'?q='+encodeURIComponent(keywordStringRaw);
                    $(keywordItem).setAttribute('href', itemUrl);
                    keywordItem.update('<span class="sbs_search_suggest_item_title">'+keywordString+'</span>');
                    this.rightSideBar.appendChild(keywordItem);
                }
            }
        }
        
        //Render products
        if( undefined !== this.responseData.result ) {
            if( undefined !== this.responseData.result.product ) {
                var divider = new Element('div').addClassName('suggest_divider').update(this.options.productsText);
                this.rightSideBar.appendChild(divider);
                for(var index in this.responseData.result.product) {
                    if(!isNaN(index)) {
                        var productData = this.responseData.result.product[index];
                        var productElement = me._getProductItem(index, productData);
                        this.rightSideBar.appendChild(productElement);
                    }
                }
            }
        }
        
        //Render brands
        if(parseInt(this.options.showBrand) > 0 && typeof this.responseData.result.facet !== 'undefined') {
            var suggestBrands = [];
            for(key in this.responseData.result.facet) {
                if(key == this.options.showBrandAttributeCode+'_facet') {
                    var brands = this.responseData.result.facet[key];
                    var i = 0;
                    for (index in brands) {
                        if (brands[index] < 1 || isNaN(brands[index]) ) {
                            continue;
                        }
                        suggestBrands[i] = [index, brands[index]];
                        i++;
                    }
                    break;
                }
            }
            if(parseInt(this.options.showBrand) > 0 && suggestBrands.length > 0){
                var viewAllBrandUrl = this.options.searchResultUrl+'/by/brand';
                var searchByBrand = new Element('span').addClassName('view-all-brand').update('<a href="'+viewAllBrandUrl+'">'+this.options.viewAllBrandsText+'</a>');
                var brandDivider = new Element('div').addClassName('suggest_category_items suggest_divider');
                var brandDividerText = new Element('span').update(this.options.brandText);
                brandDivider.appendChild(brandDividerText);
              //  brandDivider.appendChild(searchByBrand);
                this.rightSideBar.appendChild(brandDivider);
                this.itemCount++;
                var brandIndex = 1;
                for (key_brand in suggestBrands) {
                    if(!isNaN(key_brand)){
                        var brandString = suggestBrands[key_brand][0];
            
                        var productCount = suggestBrands[key_brand][1];
                        var productCountFormatted = productCount+'&nbsp;'+this.options.productText;
                        if(parseInt(productCount) > 1)
                        {
                            productCountFormatted = productCount+'&nbsp;'+this.options.productsText;
                        }
                        var reg = new RegExp('\\b' + this.responseData.q.match(/\w+/g).join('|\\b'), 'gi');
                        var brandStringFormatted = SolrBridgeSearch.highlight(brandString, reg);
                        var brandItem = new Element('a',{id:'sbs_'+this.id+'_brand_index_'+key_brand,style:'cursor:pointer;',onmouseover:'$(this).addClassName("selected")',onmouseout:'$(this).removeClassName("selected")'}).addClassName('brand suggested-item');
                        var brandUrl = this.options.searchResultUrl+'?q='+this.responseData.q+'&fq['+this.options.showBrandAttributeCode+']='+encodeURIComponent(brandString);
                        $(brandItem).setAttribute('href', brandUrl);
                        //brandItem.update('<span class="sbs_search_suggest_item_title">'+brandStringFormatted+'</span><br/><span class="sbs_search_suggest_item_subtitle">'+productCountFormatted+'</span>');
                        
                        if(brandimagepaths[brandString]) {
                            var brandimgsrc=this.options.ajaxBaseUrl+'/media/'+brandimagepaths[brandString];
                            brandItem.update('<span style="float:left;margin-right: 5px;padding-top:3px;"><img src="'+brandimgsrc+'" width="50" height="30"/></span> <span class="sbs_search_suggest_item_title">'+brandStringFormatted+'</span><br/><span class="sbs_search_suggest_item_subtitle">'+productCountFormatted+'</span>');
                        } else {
                            var brandimgsrc=this.options.ajaxBaseUrl+'/media/aw_shopbybrand/solrimage/brand.png';
                            brandItem.update('<span style="float:left;margin-right: 5px;padding-top:3px;"><img src="'+brandimgsrc+'" width="50" height="30"/></span> <span class="sbs_search_suggest_item_title">'+brandStringFormatted+'</span><br/><span class="sbs_search_suggest_item_subtitle">'+productCountFormatted+'</span>');
                        }
                            
                        this.rightSideBar.appendChild(brandItem);
            
                        if(brandIndex >= parseInt(this.options.brandLimit)) break;
            
                        brandIndex++;
                        this.itemCount++;
                    }
                }
            }
        }
        
        //Render categories
        this._renderCategory();
        
        if(!document.getElementById('sbs_'+this.id+'_view_all_link')){
            var bottomDiv = new Element('div').addClassName('sbs_search_autocomplete_box_bottom');
            bottomDiv.update('<span id="sbs_'+this.id+'_view_all_link"></span>');
            this.container.appendChild(bottomDiv);
        }
        
          if(document.getElementById("solrrun").value == '1')
          {
          var viewAllLink = document.getElementById("catalogsurl").value+'?order=bestsellers&q='+this.responseData.q;
          }
         else {
         var viewAllLink = this.options.searchResultUrl+'?q='+this.responseData.q;
          }
          
        $('sbs_'+this.id+'_view_all_link').update('<a href="'+encodeURI(viewAllLink)+'">'+this.options.viewAllResultText.replace('%s', '<b>'+this.responseData.q+' >></b>'));
        
        this.show();
        
        this._loadAjaxPrice();
    },
    _renderCategory: function() {
        if(typeof this.responseData.result.facet.category_path !== 'undefined') {
            var objectLength = Object.keys(this.responseData.result.facet.category_path).length;
            if (objectLength > 0) {
                var viewAllCategoryUrl = this.options.searchResultUrl+'/by/category';
                var searchByCategory = new Element('span').addClassName('view-all-category').update('<a href="'+viewAllCategoryUrl+'">'+this.options.viewAllCategoryText+'</a>');
                var categoryDivider = new Element('div').addClassName('suggest_category_items suggest_divider');
                var categoryDividerText = new Element('span').update(this.options.categoryText);
                categoryDivider.appendChild(categoryDividerText);
             //   categoryDivider.appendChild(searchByCategory);
                this.rightSideBar.appendChild(categoryDivider);
                this.itemCount++;
                var catIndex = 1;
                var categoryFacet = this.responseData.result.facet.category_path;
                for (key_cat in categoryFacet) {
                    
                    if(categoryFacet[key_cat] < 1 || isNaN(categoryFacet[key_cat])) {
                        continue;
                    }
                    var categoryString = key_cat;
                    var categoryArray = categoryString.split('/');
                    var catPathArray = [];
                    for (var index = 0; index < categoryArray.length; ++index) {
                        if( (index%2) == 0)
                        {
                            catPathArray.push(categoryArray[index]);
                        }
                    }
        
                    catPath = catPathArray.join('&nbsp;>&nbsp;');
                    catPath = catPath.replace(/_._._/g,"/");
                    
                    var reg = new RegExp('\\b' + this.responseData.q.match(/\w+/g).join('|\\b'), 'gi');
                    var catPathFormatted = SolrBridgeSearch.highlight(catPath, reg);
                    
                    var productCount = categoryFacet[key_cat];
                    var productCountFormatted = productCount+'&nbsp;'+this.options.productText;
                    if(parseInt(productCount) > 1) {
                        productCountFormatted = productCount+'&nbsp;'+this.options.productsText;
                    }
        
                    var categoryItem = new Element('a',{id:'sbs_'+this.id+'_category_index_'+key_cat,style:'cursor:pointer;',onmouseover:'$(this).addClassName("selected")',onmouseout:'$(this).removeClassName("selected")'}).addClassName('category suggested-item');
                    var categoryUrl = this._getCategoryUrl(key_cat);
                    $(categoryItem).setAttribute('href', categoryUrl);
                    categoryItem.update('<span class="sbs_search_suggest_item_title">'+catPathFormatted+'</span><br/><span class="sbs_search_suggest_item_subtitle">'+productCountFormatted+'</span>');
                        
                    this.rightSideBar.appendChild(categoryItem);
        
                    if(catIndex >= parseInt(this.options.categoryLimit)) break;
        
                    catIndex++;
                    this.itemCount++;
                }
            }
        }
    },
    _getCategoryUrl: function(category) {
        var start = 0;
        var end = category.lastIndexOf("/");
        var categoryString = category.substring(start, end);
        var currentCatName = categoryString.substring(categoryString.lastIndexOf("/") + 1,categoryString.length);
        var currentCatId = category.substring(category.lastIndexOf("/") + 1,category.length);
        
        var catLink = this.options.searchResultUrl+'?q='+this.responseData.q+'&fq[category]='+currentCatName+'&fq[category_id]='+currentCatId;
        
        if(parseInt(this.options.categoryRedirect) > 0) {
            catLink = this.options.searchResultUrl+'/ajax/category?cat_id='+currentCatId;
        }
        return catLink;
    },
    processResponse: function(response) {
        if (typeof response === 'undefined' && this.currentValue.length == 0) {
            this.hide();
            return;
        }
        if (response && (response.status == 'ERROR' || this.currentValue.length == 0 || response.timestamp != this.timestamp)) {
            this.hide();
            return;
        }
        this.responseData = response;
        this.renderResult();
    },
    redirectToUrl: function(url){
        window.location = url;
    },
    redirectToProduct: function(productid){
        window.location=this.options.searchResultUrl+'/ajax/product?productid='+productid+'&currency='+this.options.currencycode;
    },
  redirectToBrand: function(brand){
     if(document.getElementById("solrrun").value == '1')
         {
          var brandLink = document.getElementById("catalogsurl").value+'?order=bestsellers&q='+this.currentKeyword+'&fq['+this.options.showBrandAttributeCode+']='+encodeURIComponent(brand);
         }
         else {
 var brandLink = this.options.searchResultUrl+'?q='+this.currentKeyword+'&fq['+this.options.showBrandAttributeCode+']='+encodeURIComponent(brand);
          }
      window.location = brandLink;
      return true;
  },
  redirectToKeyword: function(keyword){
       if(document.getElementById("solrrun").value == '1')
          {
         var keywordLink = document.getElementById("catalogsurl").value+'?order=bestsellers&q='+encodeURIComponent(keyword);
          }
          else
          {
        var keywordLink = this.options.searchResultUrl+'?q='+encodeURIComponent(keyword);
           }
      window.location = keywordLink;
      return true;
  },
  redirectToCategory: function(category){
      var start = 0;
      var end = category.lastIndexOf("/");
      var categoryString = category.substring(start, end);
      var currentCatName = categoryString.substring(categoryString.lastIndexOf("/") + 1,categoryString.length);
      var currentCatId = category.substring(category.lastIndexOf("/") + 1,category.length);
      if(parseInt(this.options.categoryRedirect) > 0){
          window.location=this.options.searchResultUrl+'/ajax/category?cat_id='+currentCatId;
          return true;
      }else{
             if(document.getElementById("solrrun").value == '1')
             {
      var catLink = document.getElementById("catalogsurl").value+'?order=bestsellers&q='+this.currentKeyword+'&fq[category]='+currentCatName+'&fq[category_id]='+currentCatId;
            }
            else
           {
     var catLink = this.options.searchResultUrl+'?q='+this.currentKeyword+'&fq[category]='+currentCatName+'&fq[category_id]='+currentCatId;
            }
          window.location = catLink;
      }
      return true;
  },
  activate: function(index) 
  {
    var divs = this.rightSideBar.childNodes;
    var activeItem;
    
    //this.action = false meaning move down and vice verse
    if( ((divs.length) - 1) === this.selectedIndex && !this.action) return;
    if( this.selectedIndex < 1 && this.action) return;
    
    // Clear previous selection:
    if (this.selectedIndex !== -1 && (divs.length) > this.selectedIndex)
    {
        if(!divs[this.selectedIndex].hasClassName('suggest_divider')){
            var classnames = divs[this.selectedIndex].className + ' suggested-item';
            classnames = classnames.split(' ');
            classnames = classnames.uniq();
            divs[this.selectedIndex].className = classnames.join(' ');
        }    
        $(divs[this.selectedIndex]).removeClassName('selected');
    }
    if(typeof divs[index] === 'undefined'){
        return;
    }
    this.selectedIndex = index;
    if (this.selectedIndex !== -1 && divs.length > this.selectedIndex)
    {
      activeItem = divs[this.selectedIndex]
      var tempclassnames = activeItem.className + ' selected';
      tempclassnames = tempclassnames.split(' ');
      tempclassnames = tempclassnames.uniq();
      activeItem.className = tempclassnames.join(' ');
    }
    
    return activeItem;
  },
  deactivate: function(div, index)
  {
    div.removeClassName('selected');
    if (this.selectedIndex === index) { this.selectedIndex = -1; }
  },
  select: function(i, obj)
  {
    var divs = this.rightSideBar.childNodes;
    var index = parseInt(i)+1;    
    var selectedValue = this.suggestions[i];
    
    var itemId = obj.id;    
    
    if ($(itemId).hasClassName('product')){
        //this.redirectToUrl(productPath);
        var productid = this.suggestionsProductIds[i];
        this.redirectToProduct(productid);
    }else if ($(itemId).hasClassName('category')){
        var selectedValue = this.suggestCategories[i][0];
        this.redirectToCategory(selectedValue);
    }else if ($(itemId).hasClassName('brand')){
        var selectedValue = this.suggestBrands[i][0];
        this.redirectToBrand(selectedValue);
    }else if ($(itemId).hasClassName('keywords')){
        var selectedValue = this.suggestKeywordsRaw[i];
        this.redirectToKeyword(selectedValue);
    }else{
        if($(itemId) != undefined) {
            var productid = this.suggestionsProductIds[i];
            this.redirectToProduct(productid);
            return;
        }else{
            return;
        }        
    }
    return true;
  },
  enterSelect: function( selectedIndex ) {
      var divs = this.rightSideBar.childNodes;
      selectedNode = divs[this.selectedIndex];
      
      if(typeof selectedNode.id !== 'undefined' && selectedNode.id.length > 0)
      {
          var end = selectedNode.id.length;
          var start = selectedNode.id.lastIndexOf("_");
          var index = selectedNode.id.substring((start+1), end);
          
          this.select(index, selectedNode);
      }
      return true;
  },
  moveUp: function() {
      console.log('yeah');
    this.action = true;
    var num = this.itemCount;
    this.adjustScroll(this.selectedIndex - 1);
  },

  moveDown: function()
  {
    this.action = false;
    var num = this.itemCount;
    this.adjustScroll(this.selectedIndex + 1);
  },

  adjustScroll: function(i) {    
    var container = this.rightSideBar;
    var activeItem = this.activate(i);
    if(typeof activeItem === 'undefined') return;
    var offsetTop = activeItem.offsetTop;
    var upperBound = container.scrollTop;
    var lowerBound = upperBound + this.options.maxHeight - 25;
    if (offsetTop < upperBound) {
      container.scrollTop = offsetTop;
    } else if (offsetTop > lowerBound) {
      container.scrollTop = offsetTop - this.options.maxHeight + 25;
    }
  },

  onSelect: function(i) {
    (this.options.onSelect || Prototype.emptyFunction)(this.suggestions[i], this.data[i]);
  },
  onMouseOut: function(obj){
      $(obj).removeClassName('selected').addClassName('suggested-item');
  },
  onMouseOver: function(obj){
      $(obj).addClassName('selected');
  }

};
function sbsexpandmenu(parent) 
{
    var mode = parent.getElementsByTagName("ul")[0].getAttribute("expanded");
    mode = mode == 1;
    (mode) ? sbscollapse(parent) : sbsexpand(parent) ;
}
function sbsexpand(parent) 
{
    parent.getElementsByTagName("ul")[0].style.display = "block";
    parent.getElementsByTagName("span")[0].style.backgroundPosition = "right center";
    parent.getElementsByTagName("ul")[0].setAttribute("expanded", "1");
}
function sbscollapse(parent) 
{
    parent.getElementsByTagName("ul")[0].style.display = "none";
    parent.getElementsByTagName("span")[0].style.backgroundPosition = "left center";
    parent.getElementsByTagName("ul")[0].setAttribute("expanded", "0");
}
Event.observe(document, 'dom:loaded', function(){ SolrBridgeSearch.isDomLoaded = true; }, false);
