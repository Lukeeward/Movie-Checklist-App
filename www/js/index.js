/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
(function () {
  'use strict';
  angular
      .module('MovieChecklist', ['ngMaterial','infinite-scroll'])
      .controller('AutoCtrl', AutoCtrl) /*Autocomplete controller*/
      .controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $mdUtil, $log) {
    $scope.toggleLeft = buildToggler('left');
    $scope.toggleRight = buildToggler('right');
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle()
              .then(function () {
                console.log("toggle " + navID + " is done");
              });
          },300);
      return debounceFn;
    }
  })
  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          console.log("close LEFT is done");
        });
    };
  })
  .directive("repeatEnd", function(){
            return {
                restrict: "A",
                link: function (scope, element, attrs) {
                    if (scope.$last) {
                        scope.$eval(attrs.repeatEnd);
                    }
                }
            };
        });
  function AutoCtrl ($timeout, $q, $log, $scope, $http) {
    var self = this;
    self.simulateQuery = false;
    self.isDisabled    = false;
    self.movies        = loadAll($http);
    $scope.movies      = self.movies
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    var test;
    $scope.onEnd = function(){
                  $("#darkLayer").hide();
                  console.log("hiding");
                  var nowdate = new Date();
                  var wutwut 
                  console.log("----------------------------------")
                  console.log(Math.abs(nowdate - test) / 1000);
                  console.log("done!!!!!!!:)");
            };
    function querySearch (query) {
      var results = query ? self.movies.filter( createFilterFor(query) ) : self.movies,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        $scope.movies = results;
        return "";
      }
    }
    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }
    function loadAll($http) {
      /* Load all movies and display list checkboxes */
      var log = [];
      $("#darkLayer").show();
      console.log("showing");
    $http.get("http://www.myapifilms.com/imdb/top?format=JSON&start=1&end=250&data=S&token=4a9e6847-5a3e-4d48-9a32-440ecd5b9df7")
      .success(function(response){
        /*TODO: use for instead of for each*/
        angular.forEach(response, function(value, key){
          this.push({name: value.title, wanted: true});
        }, log);
      });
      test = new Date();
      return log;
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.name.toLowerCase().indexOf(lowercaseQuery) === 0);
      };
    }
  }
})();

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};


