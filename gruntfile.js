/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                mangle: false, //behåll variabelnamn
                compress: {
                    drop_console: true //ta bort console.log
                }
            },
            aplapp: {
                files: {
                    'js/aplapp.min.js': [
                        /* GLOBAL */
                        'src/js/global/globalVars.js',
                        'src/js/global/configAngular.js',
                        'src/js/global/globalService.js',
                        'src/js/global/loginService.js',
                        'src/js/global/registrationService.js',
                        'src/js/global/loginController.js',
                        'src/js/global/logoutController.js',
                        'src/js/global/registrationController.js',
                        'src/js/global/kommentarController.js',
                        /* LÄRARE */
                        'src/js/larare/larareKontaktService.js',
                        'src/js/larare/larareMomentService.js',
                        'src/js/larare/larareNatverkService.js',
                        'src/js/larare/larareOversiktService.js',
                        'src/js/larare/larareRedigeraAnvService.js',
                        'src/js/larare/larareSeLoggbokService.js',
                        'src/js/larare/larareSeNarvaroService.js',
                        'src/js/larare/larareService.js',
                        'src/js/larare/larareController.js',
                        'src/js/larare/larareKontaktController.js',
                        'src/js/larare/larareMomentController.js',
                        'src/js/larare/larareNatverkController.js',
                        'src/js/larare/larareOversiktController.js',
                        'src/js/larare/larareRedigeraAnvController.js',
                        'src/js/larare/larareRegHandledareController.js',
                        'src/js/larare/larareSeLoggbokController.js',
                        'src/js/larare/larareSeNarvaroController.js',
                        'src/js/larare/larareSettingsController.js',
                        'src/js/larare/larareTilldelaHandledareController.js',
                        'src/js/larare/larareTilldelaMomentController.js',
                        /* ELEV */
                        'src/js/elev/elevAktivitetService.js',
                        'src/js/elev/elevKontaktService.js',
                        'src/js/elev/elevLoggbokService.js',
                        'src/js/elev/elevSeLoggbokService.js',
                        'src/js/elev/elevSeMomentService.js',
                        'src/js/elev/elevSeNarvaroService.js',
                        'src/js/elev/elevController.js',
                        'src/js/elev/elevAktivitetController.js',
                        'src/js/elev/elevKontaktController.js',
                        'src/js/elev/elevLoggbokController.js',
                        'src/js/elev/elevNarvaroController.js',
                        'src/js/elev/elevSeLoggbokController.js',
                        'src/js/elev/elevSeMomentController.js',
                        'src/js/elev/elevSeNarvaroController.js',
                        /* HANDLEDARE */
                        'src/js/handledare/handledareAktivitetService.js',
                        'src/js/handledare/handledareKontaktService.js',
                        'src/js/handledare/handledareMomentService.js',
                        'src/js/handledare/handledareController.js',
                        'src/js/handledare/handledareAktivitetController.js',
                        'src/js/handledare/handledareKontaktController.js',
                        'src/js/handledare/handledareMomentController.js',
                        'src/js/handledare/handledareService.js'
                    ]
                }
            }
        }, //end uglify
        copy: {
            all: {
                files: [
                    {src: 'index.html', dest: 'build/index.html'},
                    {src: 'icon.ico', dest: 'build/icon.ico'},
                    {src: 'templates/**', dest: 'build/'},
                    {src: 'css/**', dest: 'build/'},
                    {src: 'js/**', dest: 'build/'},
                    {src: 'bower_components/**', dest: 'build/'}

                ]
            }
        }, //end copy
        "ftp-deploy": {
            build: {
                auth: {
                    host: '10.97.72.5',
                    port: 21,
                    authKey: 'labbserver'
                },
                src: 'build/',
                dest: 'frontend/'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //copy tasks
    grunt.loadNpmTasks('grunt-contrib-copy');
    //ftp task
     grunt.loadNpmTasks('grunt-ftp-deploy');
    
    // Default task(s).
    grunt.registerTask('build', ['uglify']);
    //Send to server
    grunt.registerTask('deploy', ['copy','ftp-deploy']);

};
