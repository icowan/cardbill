(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[6],{d352:function(e,t,a){"use strict";var n=a("tAuX"),r=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("y8nQ");var d=r(a("Vl3Y"));a("IzEo");var i=r(a("bx4M"));a("fOrg");var l=r(a("+KLJ")),o=r(a("2Taf")),u=r(a("vZ4D")),c=r(a("l4Ni")),f=r(a("ujKo")),s=r(a("MhPg")),h=n(a("q1tI")),v=a("y1Nh"),m=a("MuoO"),p=r(a("jfwr")),g=function(e,t,a,n){var r,d=arguments.length,i=d<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,a):n;if("object"===typeof Reflect&&"function"===typeof Reflect.decorate)i=Reflect.decorate(e,t,a,n);else for(var l=e.length-1;l>=0;l--)(r=e[l])&&(i=(d<3?r(i):d>3?r(t,a,i):r(t,a))||i);return d>3&&i&&Object.defineProperty(t,a,i),i},y=function(e){function t(){var e;return(0,o.default)(this,t),e=(0,c.default)(this,(0,f.default)(t).apply(this,arguments)),e.state={width:"100%"},e.resizeFooterToolbar=function(){requestAnimationFrame(function(){var t=document.querySelectorAll(".ant-layout-sider")[0];if(t){var a="calc(100% - ".concat(t.style.width,")"),n=e.state.width;n!==a&&e.setState({width:a})}})},e.renderMessage=function(e){return h.default.createElement(l.default,{style:{marginBottom:24},message:e,type:"error",showIcon:!0})},e.onLoadBanks=function(){var t=e.props.dispatch;t({type:"record/banks"})},e.onAddCard=function(t){var a=e.props.dispatch;a({type:"record/addCreditCard",payload:t})},e}return(0,s.default)(t,e),(0,u.default)(t,[{key:"componentDidMount",value:function(){window.addEventListener("resize",this.resizeFooterToolbar,{passive:!0});var e=this.props.dispatch;e({type:"record/creditCards"})}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.resizeFooterToolbar)}},{key:"render",value:function(){var e=this.props,t=e.record,a=t.banks,n=t.creditCards,r=e.form.getFieldDecorator;return h.default.createElement("div",null,h.default.createElement(v.PageHeaderWrapper,{content:"\u968f\u65f6\u968f\u5730\u8bb0\u5f55\u60a8\u7684\u5237\u5361\u8bb0\u5f55\u3002"},h.default.createElement(i.default,{title:"\u5237\u5361\u8bb0\u5f55",bordered:!1},r("record",{initialValue:n})(h.default.createElement(p.default,{onChange:this.onAddCard,onLoadBanks:this.onLoadBanks,banks:a,creditCards:n})))))}}]),t}(h.Component);y=g([(0,m.connect)(function(e){var t=e.record,a=e.loading;return{record:t,submitting:a.effects["record/creditCards"]}})],y);var b=d.default.create()(y);t.default=b},jfwr:function(e,t,a){"use strict";var n=a("tAuX"),r=a("g09b");Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("g9YV");var d=r(a("wCAj"));a("+L6B");var i=r(a("2/Rp"));a("giR+");var l=r(a("fyUT"));a("5NDa");var o=r(a("5rEg"));a("miYZ");var u=r(a("tsqr")),c=r(a("gWZ8")),f=r(a("p0pE")),s=r(a("2Taf")),h=r(a("vZ4D")),v=r(a("l4Ni")),m=r(a("ujKo")),p=r(a("MhPg"));a("OaEy");var g=r(a("2fM7")),y=n(a("q1tI")),b=r(a("XaGS")),w=g.default.Option,k=function(e){function t(e){var a;return(0,s.default)(this,t),a=(0,v.default)(this,(0,m.default)(t).call(this,e)),a.clickedCancel=!1,a.index=0,a.cacheOriginData={},a.toggleEditable=function(e,t){e.preventDefault();var n=a.state.data,r=void 0===n?[]:n,d=r.map(function(e){return(0,f.default)({},e)}),i=a.getRowByKey(t,d);i&&(i.editable||(a.cacheOriginData[t]=(0,f.default)({},i)),i.editable=!i.editable,a.setState({data:[]}))},a.newRecord=function(){var e=a.state.data,t=void 0===e?[]:e,n=t.map(function(e){return(0,f.default)({},e)}),r=a.props.onLoadBanks;r(),n.push({id:a.index,isNew:!0,editable:!0}),a.index+=1,a.setState({data:n})},a.onChangeData=function(e,t,n){var r=a.state.data,d=void 0===r?[]:r,i=(0,c.default)(d),l=a.getRowByKey(n,i);l&&(l[t]=e,a.setState({data:i}))},a.state={data:e.value,loading:!1,value:e.value},a}return(0,p.default)(t,e),(0,h.default)(t,[{key:"getRowByKey",value:function(e,t){var a=this.state.data,n=void 0===a?[]:a;return(t||n).filter(function(t){return t.id===e})[0]}},{key:"handleFieldChange",value:function(e,t,a){var n=this.state.data,r=void 0===n?[]:n,d=(0,c.default)(r),i=this.getRowByKey(a,d);i&&(i[t]=e.target.value,this.setState({data:d}))}},{key:"saveRow",value:function(e,t){var a=this;e.persist(),this.setState({loading:!0}),setTimeout(function(){if(a.clickedCancel)a.clickedCancel=!1;else{var n=a.getRowByKey(t)||{};if(!n.bank_id||!n.card_name||!n.billing_day||!n.cardholder||!n.fixed_amount||!n.max_amount)return u.default.error("\u8bf7\u586b\u5199\u5b8c\u6574\u6210\u5458\u4fe1\u606f\u3002"),e.target.focus(),void a.setState({loading:!1});delete n.isNew,a.toggleEditable(e,t);a.state.data;var r=a.props.onChange;r&&r([n]),a.setState({loading:!1,data:[]})}},500)}},{key:"render",value:function(){var e=this,t=this.state,a=t.loading,n=t.data,r=this.props.banks,u=[];for(var c in r)u.push(y.default.createElement(w,{key:r[c].id},r[c].bank_name));var f=[{title:"\u94f6\u884c",dataIndex:"bank",key:"bank",width:180,render:function(t,a){return a.editable?y.default.createElement(g.default,{style:{width:"100%"},placeholder:"\u8bf7\u9009\u62e9\u94f6\u884c",onChange:function(t){return e.onChangeData(t,"bank_id",a.id)},dropdownRender:function(e){return y.default.createElement("div",null,e)}},u):t.bank_name}},{title:"\u4fe1\u7528\u5361",dataIndex:"card_name",key:"card_name",width:160,render:function(t,a){return a.editable?y.default.createElement(o.default,{onChange:function(t){return e.handleFieldChange(t,"card_name",a.id)},placeholder:"\u8bf7\u8f93\u5165\u4fe1\u7528\u5361"}):t}},{title:"\u56fa\u5b9a\u989d\u5ea6",dataIndex:"fixed_amount",key:"fixed_amount",width:180,render:function(t,a){return a.editable?y.default.createElement(l.default,{min:1,max:999999,placeholder:"\u56fa\u989d",onChange:function(t){return e.onChangeData(t,"fixed_amount",a.id)}}):t}},{title:"\u4e34\u65f6\u989d\u5ea6",dataIndex:"max_amount",key:"max_amount",width:180,render:function(t,a){return a.editable?y.default.createElement(l.default,{min:1,max:999999,placeholder:"\u4e34\u989d",onChange:function(t){return e.onChangeData(t,"max_amount",a.id)}}):t}},{title:"\u8d26\u5355\u65e5",dataIndex:"billing_day",key:"billing_day",render:function(t,a){return a.editable?y.default.createElement(l.default,{min:1,max:31,placeholder:"\u8d26\u5355\u65e5",onChange:function(t){return e.onChangeData(t,"billing_day",a.id)}}):"\u6bcf\u6708 "+t+" \u65e5"}},{title:"\u8fd8\u6b3e\u65e5",dataIndex:"cardholder",key:"cardholder",width:120,render:function(t,a){return a.editable?y.default.createElement(l.default,{min:1,max:31,placeholder:"\u8fd8\u6b3e\u65e5",onChange:function(t){return e.onChangeData(t,"cardholder",a.id)}}):"\u6bcf\u6708 "+t+" \u65e5"}},{title:"\u72b6\u6001",dataIndex:"state",key:"state",width:160,render:function(t,a){return a.editable?y.default.createElement(g.default,{style:{width:"100%"},placeholder:"\u8bf7\u9009\u62e9\u72b6\u6001",onChange:function(t){return e.onChangeData(t,"state",a.id)}},y.default.createElement(w,{key:0},"\u6b63\u5e38"),y.default.createElement(w,{key:1},"\u7981\u7528")):0==t?"\u6b63\u5e38":"\u5176\u4ed6"}},{title:"\u64cd\u4f5c",key:"action",render:function(t,a){var n=e.state.loading;return a.editable&&n?null:a.editable&&a.isNew?y.default.createElement("span",null,y.default.createElement("a",{onClick:function(t){return e.saveRow(t,a.id)}},"\u6dfb\u52a0")):y.default.createElement("span",null)}}];return y.default.createElement(y.Fragment,null,y.default.createElement(i.default,{style:{width:"100%",marginTop:16,marginBottom:8},type:"dashed",onClick:this.newRecord,icon:"plus"},"\u65b0\u589e\u4fe1\u7528\u5361"),y.default.createElement(d.default,{loading:a,columns:f,dataSource:n||[],pagination:!1}))}}],[{key:"getDerivedStateFromProps",value:function(e,t){return(0,b.default)(e.value,t.value)?null:{data:e.value,value:e.value}}}]),t}(y.PureComponent),C=k;t.default=C}}]);