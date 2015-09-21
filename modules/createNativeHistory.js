import { AsyncStorage } from 'react-native';

import invariant from 'invariant'
import { PUSH, REPLACE, POP } from './Actions'
import createLocation from './createLocation'
import createHistory from './createHistory'

let DefaultStorageKey = '@@ReactRouterNativeHistory'

function saveEntries(key, data, callback) {
  if (typeof window.localStorage === 'undefined') {
    AsyncStorage.setItem(key, JSON.stringify(data), callback || () => {})
  } else {
    window.localStorage.setItem(key, JSON.stringify(data))
    callback && callback()
  }
}

function readEntriesAndCurrent(key, callback) {
  if (typeof window.localStorage === 'undefined') {
    AsyncStorage.getItem(key, function (error, json) {
      if (error) {
        callback(error)
      } else {
        try {
          callback(null, JSON.parse(json))
        } catch (error) {
          callback(null, []) // Ignore invalid JSON.
        }
      }
    })
  } else {
    let json = window.localStorage.getItem(key);
    callback(null, JSON.parse(json));
  }
}

function createStorage(entries) {
  return entries
    .filter(entry => entry.state)
    .reduce((memo, entry) => {
      memo[entry.key] = entry.state
      return memo
    }, {})
}

/**
 * Native History implementation
 *
 **/
function createNativeHistory(createCallback) {
  let options = {};

  let storageKey = options.storageKey || DefaultStorageKey;

  let entries = [], storage;

  readEntriesAndCurrent(storageKey, (err, data) => {
    let history = createHistory({
      ...options,
      getCurrentLocation,
      finishTransition,
      saveState,
      go
    })

    let entriesFromStorage, current;

    if (!data) {
      entriesFromStorage = [ '/' ];
    } else {
      entriesFromStorage = data.entries;
      current = data.current;
    }

    entries = entriesFromStorage.map(function (entry) {
      let key = history.createKey()

      if (typeof entry === 'string')
        return { pathname: entry, key }

      if (typeof entry === 'object' && entry)
        return { ...entry, key }

      invariant(
        false,
        'Unable to create history entry from %s',
        entry
      )
    })

    if (current == null) {
      current = entries.length - 1
    } else {
      invariant(
        current >= 0 && current < entries.length,
        'Current index must be >= 0 and < %s, was %s',
        entries.length, current
      )
    }

    storage = createStorage(entries)

    function saveState(key, state) {
      storage[key] = state
      saveEntries(storageKey, {
        entries,
        current
      });
    }

    function readState(key) {
      return storage[key]
    }

    function getCurrentLocation() {
      let entry = entries[current]
      let { key, pathname, search } = entry
      let path = pathname + (search || '')

      let state
      if (key) {
        state = readState(key)
      } else {
        state = null
        key = history.createKey()
        entry.key = key
      }

      return createLocation(path, state, undefined, key)
    }

    function canGo(n) {
      let index = current + n
      return index >= 0 && index < entries.length
    }

    function go(n) {
      if (n) {
        invariant(
          canGo(n),
          'Cannot go(%s) there is not enough history',
          n
        )

        current += n

        let currentLocation = getCurrentLocation()

        // change action to POP
        history.transitionTo({ ...currentLocation, action: POP })
      }
    }

    function finishTransition(location) {
      switch (location.action) {
        case PUSH:
          current += 1

          // if we are not on the top of stack
          // remove rest and push new
          if (current < entries.length) {
            entries.splice(current)
          }

          entries.push(location)
          saveState(location.key, location.state)
          break
        case REPLACE:
          entries[current] = location
          saveState(location.key, location.state)
          break
      }
    }

    createCallback(history)
  })
}

export default createNativeHistory;
