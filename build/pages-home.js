"use strict";(self.__LOADABLE_LOADED_CHUNKS__=self.__LOADABLE_LOADED_CHUNKS__||[]).push([[676],{8515:(e,t,a)=>{a.r(t),a.d(t,{default:()=>U});var i=a(5861),s=a(7294),r=a(5697),n=a.n(r),o=a(6896),l=a(4012),c=a(6550),d=a(8527),m=a(5193),p=a(7462),h=a(5987),u=a(4651);const g=["title","img","actions"],f=e=>{let{title:t,img:a,actions:i}=e,r=(0,h.Z)(e,g);const{src:n,alt:o}=a;return s.createElement(d.xu,(0,p.Z)({marginBottom:{base:0,md:10},height:{lg:"xl"},position:{lg:"relative"}},r),s.createElement(d.Kq,{align:"center",spacing:{base:8,md:10},paddingTop:{base:12,md:10},paddingBottom:{base:6,md:10},direction:{base:"column",lg:"row"}},s.createElement(d.Kq,{flex:1,spacing:{base:5,md:8}},s.createElement(d.X6,{as:"h1",fontSize:{base:"4xl",md:"5xl",lg:"6xl"},maxWidth:{base:"75%",md:"50%",lg:"md"}},t),i&&s.createElement(d.xu,{width:{base:"full",lg:"inherit"}},i)),s.createElement(d.kC,{flex:1,justify:"center",align:"center",position:"relative",width:"full",paddingTop:{base:4,lg:0}},s.createElement(d.xu,{position:"relative",width:{base:"full",md:"80%",lg:"full"}},s.createElement(u.Ee,{fit:"cover",align:"center",width:"100%",height:"100%",src:n,alt:o})))))};f.displayName="Hero",f.propTypes={img:n().shape({src:n().string,alt:n().string}),title:n().string,actions:n().element};const b=f;var v=a(9065);const y=["title","subtitle","actions","maxWidth","children"],x=e=>{let{title:t,subtitle:a,actions:i,maxWidth:r,children:n}=e,o=(0,h.Z)(e,y);const l=r||"3xl";return s.createElement(d.xu,(0,p.Z)({as:"section",paddingBottom:"16"},o),s.createElement(d.Kq,{spacing:4,as:d.W2,maxW:l,textAlign:"center"},t&&s.createElement(d.X6,{as:"h2",fontSize:40,textAlign:"center"},t),a&&s.createElement(d.xv,{color:"gray.700",fontWeight:600},a),i&&s.createElement(d.xu,{paddingTop:"2",width:{base:"full",md:"auto"}},i)),n)};x.displayName="Section",x.propTypes={title:n().string,subtitle:n().oneOfType([n().array,n().string,n().node]),children:n().node,actions:n().element,maxWidth:n().string};const E=x;a(6158);var _=a(8871),w=a(49),k=a(9731);const M=[{message:(0,w.vU)({title:{defaultMessage:[{type:0,value:"Download on Github"}],id:"home.hero_features.link.on_github"}}),icon:s.createElement(k.bY,{width:12,height:12}),href:"https://github.com/SalesforceCommerceCloud/pwa-kit"},{message:(0,w.vU)({title:{defaultMessage:[{type:0,value:"Deploy on Managed Runtime"}],id:"home.hero_features.link.on_managed_runtime"}}),icon:s.createElement(k.Oc,{width:12,height:8}),href:"https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/pushing-and-deploying-bundles.html"},{message:(0,w.vU)({title:{defaultMessage:[{type:0,value:"Create with the Figma PWA Design Kit"}],id:"home.hero_features.link.design_kit"}}),icon:s.createElement(k.u2,{width:12,height:8}),href:"https://sfdc.co/figma-pwa-design-kit"}];(0,w.vU)({title:{defaultMessage:[{type:0,value:"Cart & Checkout"}],id:"home.features.heading.cart_checkout"},text:{defaultMessage:[{type:0,value:"Ecommerce best practice for a shopper's cart and checkout experience."}],id:"home.features.description.cart_checkout"}}),k.wh,(0,w.vU)({title:{defaultMessage:[{type:0,value:"Einstein Recommendations"}],id:"home.features.heading.einstein_recommendations"},text:{defaultMessage:[{type:0,value:"Deliver the next best product or offer to every shopper through product recommendations."}],id:"home.features.description.einstein_recommendations"}}),k.lM,(0,w.vU)({title:{defaultMessage:[{type:0,value:"My Account"}],id:"home.features.heading.my_account"},text:{defaultMessage:[{type:0,value:"Shoppers can manage account information such as their profile, addresses, payments and orders."}],id:"home.features.description.my_account"}}),k.fr,(0,w.vU)({title:{defaultMessage:[{type:0,value:"Shopper Login and API Access Service"}],id:"home.features.heading.shopper_login"},text:{defaultMessage:[{type:0,value:"Enable shoppers to easily log in with a more personalized shopping experience."}],id:"home.features.description.shopper_login"}}),k.BW,(0,w.vU)({title:{defaultMessage:[{type:0,value:"Components & Design Kit"}],id:"home.features.heading.components"},text:{defaultMessage:[{type:0,value:"Built using Chakra UI, a simple, modular and accessible React component library."}],id:"home.features.description.components"}}),k.QG,(0,w.vU)({title:{defaultMessage:[{type:0,value:"Wishlist"}],id:"home.features.heading.wishlist"},text:{defaultMessage:[{type:0,value:"Registered shoppers can add product items to their wishlist from purchasing later."}],id:"home.features.description.wishlist"}}),k.h_;var S=a(3269),R=a(3162);const C=({productSearchResult:e,isLoading:t})=>{const a=(0,o.Z)(),i=(0,S.Z)(),{pathname:r}=(0,c.TH)();return(0,s.useEffect)((()=>{i.sendViewPage(r)}),[]),s.createElement(d.xu,{"data-testid":"home-page",layerStyle:"page"},s.createElement(v.Z,{title:"Home Page",description:"Commerce Cloud Retail React App",keywords:"Commerce Cloud, Retail React App, React Storefront"}),s.createElement(b,{title:a.formatMessage({defaultMessage:[{type:0,value:"The React PWA Starter Store for Retail"}],id:"home.title.react_starter_store"}),img:{src:(0,_.Vh)("static/img/hero.png"),alt:"npx pwa-kit-create-app"},actions:s.createElement(d.Kq,{spacing:{base:4,sm:6},direction:{base:"column",sm:"row"}},s.createElement(m.zx,{as:d.rU,href:"https://developer.salesforce.com/docs/commerce/pwa-kit-managed-runtime/guide/getting-started.html",target:"_blank",width:{base:"full",md:"inherit"},paddingX:7,_hover:{textDecoration:"none"}},s.createElement(l.Z,{defaultMessage:[{type:0,value:"Get started"}],id:"home.link.get_started"})))}),s.createElement(E,{background:"gray.50",marginX:"auto",paddingY:{base:8,md:16},paddingX:{base:4,md:8},borderRadius:"base",width:{base:"100vw",md:"inherit"},position:{base:"relative",md:"inherit"},left:{base:"50%",md:"inherit"},right:{base:"50%",md:"inherit"},marginLeft:{base:"-50vw",md:"auto"},marginRight:{base:"-50vw",md:"auto"}},s.createElement(d.MI,{columns:{base:1,md:1,lg:3},spacingX:{base:1,md:4},spacingY:{base:4,md:14}},M.map(((e,t)=>{const i=e.message;return s.createElement(d.xu,{key:t,background:"white",boxShadow:"0px 2px 2px rgba(0, 0, 0, 0.1)",borderRadius:"4px"},s.createElement(d.rU,{target:"_blank",href:e.href},s.createElement(d.Ug,null,s.createElement(d.kC,{paddingLeft:6,height:24,align:"center",justify:"center"},e.icon),s.createElement(d.xv,{fontWeight:"700"},a.formatMessage(i.title)))))})))))};C.getTemplateName=()=>"home",C.shouldGetProps=({previousLocation:e,location:t})=>!e||e.pathname!==t.pathname,C.getProps=function(){var e=(0,i.Z)((function*({res:e,api:t}){return e&&e.set("Cache-Control",`max-age=${R.RU}`),{productSearchResult:yield t.shopperSearch.productSearch({parameters:{refine:[`cgid=${R.EP}`,"htype=master"],limit:R.DN}})}}));return function(t){return e.apply(this,arguments)}}(),C.propTypes={productSearchResult:n().object,isLoading:n().bool};const U=C}}]);