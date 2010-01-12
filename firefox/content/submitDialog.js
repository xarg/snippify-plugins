/* ***** BEGIN LICENSE BLOCK *****
 *   Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is snippify.
 *
 * The Initial Developer of the Original Code is
 * Alexandru Plugaru.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
var submitDialog = {
	onLoad: function(e){
		document.getElementById('submitDialog').centerWindowOnScreen()
		if(window.arguments[0]['submitDialogBody'] != undefined){
			document.getElementById('submitDialogBody').value = window.arguments[0]['submitDialogBody']
		}
	},
	onAccept: function(e){
		data = {}
		data['title'] = document.getElementById('submitDialogTitle').value
		data['description'] = document.getElementById('submitDialogDescription').value
		data['body'] = document.getElementById('submitDialogBody').value
		data['tags'] = document.getElementById('submitDialogTags').value
		data['privacy'] = document.getElementById('submitDialogPrivacy').checked?'private':'public'
		data['via'] = 'firefox'
		if(data['title'] == ''){
			alert('Please enter title');
			document.getElementById('submitDialogTitle').focus()
			return false;
		}
		if(data['body'] == ''){
			alert('Please enter body');
			document.getElementById('submitDialogBody').focus()
			return false;
		}
		var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		var apiurl = prefManager.getCharPref("extensions.snippify.apiurl")
		var restkey = prefManager.getCharPref("extensions.snippify.restkey")

		if ( restkey.length != 40 ){
			alert("Please set the private key in the preferences dialog. You can get it from your profile page on snippify.me")
			return false;
		}
		if( apiurl == ''){
			alert("Please set the api url in the preferences dialog.")
			return false;
		}
		//Execute request to server
		var req = new XMLHttpRequest()
		req.open('POST', apiurl + 'create/', false)
		req.onreadystatechange = function (aEvt) {
		  if (req.readyState == 4) {
			if(req.status == 200) // Needs some repsonse handling
				dump(req.responseText)
			else
				dump("Error loading page\n");
		  }
		};
		data_str = 'data=' + JSON.stringify(data);
		req.setRequestHeader("Content-Length", data_str.length)
		req.setRequestHeader("Content-Type", "text/plain")
		req.setRequestHeader('RESTKEY', restkey)
		req.send(data_str)
		return true;
	},
	onCancel: function(e){

	}
}