'use strict';

function musicService(url) {


  this.url = url;


  this._myFetch = async function (url, method = null, body = null) {
    try {
      method ??= 'GET';

      let fetchOptions = { method };

      if (method !== 'GET') {
        fetchOptions.headers = { 'content-type': 'application/json' };
        fetchOptions.body = body ? JSON.stringify(body) : null;
      }

      let res = await fetch(url, fetchOptions);

      if (res.ok) {
        let data = await res.json();
        return data;
      } else {
        alert(`Failed to recieved data from server: ${res.status}`);
      }
    } catch (err) {
      alert(`Failed to recieved data from server: ${err.message}`);
    }
  }

  this._readItemsAsync = async function (reqUrl, pageNr, flat, filter, pageSize) {
    reqUrl += `?flat=${flat}&pageNr=${pageNr}&pageSize=${pageSize}`;
    if (filter != null) {
      reqUrl += `&filter=${filter}`;
    }
    let data = await this._myFetch(reqUrl);
    return data;
  }

  this._readItemAsync = async function (reqUrl, id, flat) {
    reqUrl += `?flat=${flat}&id=${id}`;
    let data = await this._myFetch(reqUrl);
    return data;
  }

  this._readItemDtoAsync = async function (reqUrl, id, flat) {
    reqUrl += `?id=${id}`;
    let data = await this._myFetch(reqUrl);
    return data;
  }


  this.readMusicGroupsAsync = async function (pageNr, flat = false, filter = null, pageSize = 10) {
    return await this._readItemsAsync(`${this.url}/MusicGroups/Read`, pageNr, flat, filter, pageSize);
  }

  this.readMusicGroupAsync = async (id, flat = false) => this._readItemAsync(`${this.url}/MusicGroups/ReadItem`, id, flat);
}

export default musicService;
