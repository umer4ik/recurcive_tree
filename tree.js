;
'use strict';
function Tree(arr) {
  this.tree = arr;
  var roots = this.findRoots();
  for (var i = 0; i < roots.length; i++) {
    var index = _.findIndex(this.tree, function(el){return el.id===roots[i]});
    var el = this.tree[index];
    if ( el.childs ) {
      this.replaceChilds(el);
    }
  };
}
Tree.prototype.replaceChilds = function(el) {
  var childs = el.childs;
  for (var j = 0; j < childs.length; j++) {
    var child = childs[j];
    var id = child.id;
    var index = _.findIndex(this.tree, function(el){
      return el.id === id;
    });
    if (index!==-1) childs[j] = this.tree.splice(index, 1)[0];
    if (childs[j].childs) this.replaceChilds(childs[j], this.tree);
  }
};
Tree.prototype.findRoots = function() {
  var childIds = [];
  var parentIds = [];
  for (var i = 0; i < this.tree.length; i++) {
    var el = this.tree[i];
    if (el.hasOwnProperty('childs') && el.childs.length > 0) {
      var childs = el.childs;
      for (var j = 0; j < childs.length; j++) {
        childIds.push(childs[j].pivot.child_id);
        parentIds.push(childs[j].pivot.parent_id);
      }
    }
  }
  childIds = _.uniq(childIds);
  parentIds = _.uniq(parentIds);
  var differenceIds = _.difference(parentIds, childIds);
  return differenceIds;
}
Tree.prototype.writeNode = function(el, node){
  var crEl = document.createElement.bind(document);
  // debugger;
  var ul = crEl('ul');
  var li = crEl('li');
  li.innerHTML = el.name;
  li.setAttribute('data-cats', el.id);
  ul.appendChild(li);
  if (node) {
    node.appendChild(ul);
  }
  if (el.childs && el.childs.length>0) {
    for (var i = 0; i < el.childs.length; i++) {
      this.writeNode(el.childs[i], li);
    }
  }
  return li;
}
Tree.prototype.domTree = function(arr) {
  var crEl = document.createElement.bind(document);
  var div = crEl('div');
  if (!arr) {
    var nodes = [];
    for (var i = 0; i < this.tree.length; i++) {
      var root = this.tree[i];
      nodes.push(this.writeNode(root));
    }
    var uls = []
    for (var i = 0; i < nodes.length; i++) {
      var ul = crEl('ul');
      ul.appendChild(nodes[i]);
      uls.push(ul);
    }
    for (var i = 0; i < uls.length; i++) {
      div.appendChild(uls[i])
    }

  } else {
    ul = crEl('ul');
    for (var i = 0; i < arr.length; i++) {
      var li = crEl('li');
      li.innerHTML = this.find(arr[i]).name;
      li.setAttribute('data-cats', JSON.stringify(this.getAllChilds(arr[i])));
      ul.appendChild(li);
    }
    div.appendChild(ul);
  }
  return div;
}
Tree.prototype.find = function (id) {
  var obj;
  function get(el){
    if (el.id == id) {
      obj = el;
      return;
    }
    for (var i = 0; i < el.childs.length; i++) {
      get(el.childs[i]);
    }
  }
  var tree = this.tree;
  for (var i = 0; i < tree.length; i++) {
    get(tree[i])
  }
  return obj;
};
Tree.prototype.getAllChilds = function (id) {
  var ids = [];
  function get(el){
    ids.push(el.id)
    for (var i = 0; i < el.childs.length; i++) {
      get(el.childs[i]);
    }
  }
  var node = this.find(id);
  get(node);
  return ids;
};
