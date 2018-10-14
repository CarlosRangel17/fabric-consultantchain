'use strict'

App.filter('devLevel', function(){
    return function(type){
        switch(type){
            case '1':
                return "Beginner";
            case '2':
                return "Intermediate";
            case '3':
                return "Advanced";
            case '4':
                return "Expert";
            default:
                return '';
        }
    }
});

App.filter('devType', function(){
    return function(type){
        switch(type){
            case 'BA':
                return "Business Analyst (BA)";
            case 'BI':
                return "Business Intelligence (BI)";
            default:
                return type;
        }
    }
});

App.filter('iconType', function(){
    return function(type) {
        switch(type){
            case 'BA':
                return "glyphicon-stats";
            case 'BI':
                return "glyphicon-tasks";
            case 'Blockchain':
                return "glyphicon-link";
            case 'Cloud':
                return "glyphicon-cloud";
            case 'Mobile':
                return "glyphicon-phone";
            case 'Web':
                return "glyphicon-globe";
        }
    }
});
