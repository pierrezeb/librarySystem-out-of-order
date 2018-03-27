
(function(){
    var libraryStorage = {};
    //temporary storage for libraries with non existing dependencies
    var tempStorage=[];


  //helper methods
  var app= {
    //retrieve libraryName
    retrieve: function(libraryName){
    return libraryStorage[libraryName]
    },
    //create library in libraryStorage
    create:function(libraryName, dependencies, callback){
    //create arrays of arguments for callback
    var callbackArgs=this.createArgListForCallback(dependencies)
      libraryStorage[libraryName]=callback(...callbackArgs)
    },

    //store library with non existing dependencies in tempStorage as an object
    storeInTemp: function(libraryName, dependencies, callback){
    tempStorage.push({
        libraryName:libraryName,
        dependencies: dependencies,
        callback:callback})
    },
      //create arrays of arguments for callback
    createArgListForCallback:function(array){
    return array.map(element => libraryStorage[element])
    },
    // check if  ALL dependencies in array exist in libraryStorage, returns true or false
    checkLibraryStorage:function(array){
      for (var i=0; i<array.length;i++){
          var currentDependency=array[i]
          if (!libraryStorage[currentDependency]){
          return false
          //break the for loop if any dependenci does not exist in libraryStorage
          break;
        }
        //if the for loop did not break return true
        if (i===array.length-1) {
          return true;
        };
      };
    },
    //delete function : with no argument => clear libraryStorage and tempStorage memories
    //with 2 aguments : delete libraryname in storage ( works with both tempStorage and libraryStorage
    delete: function(storage, libraryName){
      if (arguments.length===0){
        libraryStorage = {};
          tempStorage=[];
      }
     else if (arguments.length===2){
       //for libraryStorage delete libraryName property
        if (storage ===libraryStorage) {
        delete libraryStorage.libraryName
        }
       //for tempStorage, find index of object with LibraryName property === libraryName,
        else if (storage === tempStorage) {
        var indexToDelete=tempStorage.findIndex(element => element.name === libraryName);
          //then splice this position from tempStorage Array
            tempStorage.splice(indexToDelete,1);
        };
      };
    },
    //check if ALL dependencies in each object in tempStorage exist in libraryStorage
    //if not : do nothing
    //if they do : create the library and delete the corresponding temporary object
    checkTempStorageinLibraryStorage: function (){
      var tempLength=tempStorage.length;
      for (var i=0;i<tempLength;i++){
        var dependenciesToTest=tempStorage[i].dependencies;
        if (app.checkLibraryStorage(dependenciesToTest)) {
        app.create(tempStorage[i].libraryName, dependenciesToTest, tempStorage[i].callback)
          app.delete(tempStorage, tempStorage[i].libraryName)
        }
        else break;
      }
    }
  };

  function librarySystem (libraryName, arrayOfDependencies, callback){
      //retrieve library
      if (arguments.length===1) {
      return app.retrieve(libraryName)
      }
      // create libraries
      else if (arguments.length===3) {
      // case 1 : no dependencies => store the library
      if (arrayOfDependencies.length===0){
      app.create(libraryName, [], callback)
      }
      //case 2 : dependencies
      else if (arrayOfDependencies.length>0){
      if (app.checkLibraryStorage(arrayOfDependencies)) {
      app.create(libraryName, arrayOfDependencies, callback)
      }
      else {
      app.storeInTemp(libraryName, arrayOfDependencies, callback)
      }
      };
      app.checkTempStorageinLibraryStorage();
      };
      //give access to libraryStorage at global scope for testing 
      this.libraryStorage=libraryStorage;
  };
    this.librarySystem=librarySystem;
    this.deleteLibrarySystem=app.delete;

})()
