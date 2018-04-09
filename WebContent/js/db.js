var DB = {};

DB.init = function() {
	if (window.confirm('are you sure to initialize database?')) {
		DB.load();
	}
};

DB.load = function() {
	// personal info
	alasql('DROP TABLE IF EXISTS emp;');
	alasql('CREATE TABLE emp(id INT IDENTITY, number STRING, name STRING, sex INT, birthday DATE, tel STRING, ctct_name STRING, ctct_addr STRING, ctct_tel STRING, pspt_no STRING, pspt_date STRING, pspt_name STRING, rental STRING);');
	var pemp = alasql.promise('SELECT MATRIX * FROM CSV("data/EMP-EMP.csv", {headers: true})').then(function(emps) {
		for (var i = 0; i < emps.length; i++) {
			alasql('INSERT INTO emp VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?);', emps[i]);
		}
	});

	// address
	alasql('DROP TABLE IF EXISTS addr;');
	alasql('CREATE TABLE addr(id INT IDENTITY, emp INT, zip STRING, state STRING, city STRING, street STRING, bldg STRING, house INT);');
	var paddr = alasql.promise('SELECT MATRIX * FROM CSV("data/ADDR-ADDR.csv", {headers: true})').then(
			function(addresses) {
				for (var i = 0; i < addresses.length; i++) {
					alasql('INSERT INTO addr VALUES(?,?,?,?,?,?,?,?);', addresses[i]);
				}
			});

	// family
	alasql('DROP TABLE IF EXISTS family;');
	alasql('CREATE TABLE family(id INT IDENTITY, emp INT, name STRING, sex INT, birthday STRING, relation STRING, cohabit INT, care INT);');
	var pfamily = alasql.promise('SELECT MATRIX * FROM CSV("data/FAMILY-FAMILY.csv", {headers: true})').then(
			function(families) {
				for (var i = 0; i < families.length; i++) {
					alasql('INSERT INTO family VALUES(?,?,?,?,?,?,?,?);', families[i]);
				}
			});

	// education
	alasql('DROP TABLE IF EXISTS edu;');
	alasql('CREATE TABLE edu(id INT IDENTITY, emp INT, school STRING, major STRING, grad STRING);');
	var pedu = alasql.promise('SELECT MATRIX * FROM CSV("data/EDU-EDU.csv", {headers: true})').then(function(edus) {
		for (var i = 0; i < edus.length; i++) {
			alasql('INSERT INTO edu VALUES(?,?,?,?,?);', edus[i]);
		}
	});

	// choice
	alasql('DROP TABLE IF EXISTS choice;');
	alasql('CREATE TABLE choice(id INT IDENTITY, name STRING, text STRING);');
	var pchoice = alasql.promise('SELECT MATRIX * FROM CSV("data/CHOICE-CHOICE.csv", {headers: true})').then(
			function(choices) {
				for (var i = 0; i < choices.length; i++) {
					alasql('INSERT INTO choice VALUES(?,?,?);', choices[i]);
				}
			});


	//applications
	alasql('DROP TABLE IF EXISTS application;');
	alasql('CREATE TABLE application(id INT,jobid INT,name STRING,phone STRING,email STRING,date STRING,address STRING ,country STRING ,isactive INT ,linkedin STRING,github STRING,stackoverflow STRING);');
	var papplication = alasql.promise('SELECT MATRIX * FROM CSV("data/APPLICATION-APPLICATION.csv", {headers: true})').then(function(applications) {
		for (var i = 0; i < applications.length; i++) {
			alasql('INSERT INTO application VALUES(?,?,?,?,?,?,?,?,?,?,?,?);', applications[i]);
		}
	});
	// departments
	alasql('DROP TABLE IF EXISTS department;');
	alasql('CREATE TABLE department(id INT,dept STRING);');
	var pdepts = alasql.promise('SELECT MATRIX * FROM CSV("data/DEPARTMENT-DEPARTMENT.csv", {headers: true})').then(function(jobs) {
		for (var i = 0; i < jobs.length; i++) {
			alasql('INSERT INTO department VALUES(?,?);', jobs[i]);
		}
	});
	// positions
	alasql('DROP TABLE IF EXISTS position;');
	alasql('CREATE TABLE position(id INT,position STRING);');
	var ppositions = alasql.promise('SELECT MATRIX * FROM CSV("data/POSITION-POSITION.csv", {headers: true})').then(function(jobs) {
		for (var i = 0; i < jobs.length; i++) {
			alasql('INSERT INTO position VALUES(?,?);', jobs[i]);
		}
	});

	// jobs
	alasql('DROP TABLE IF EXISTS job;');
	alasql('CREATE TABLE job(id INT,position INT,date STRING, description STRING, active INT, closedate STRING, dept INT, employment STRING);');
	var pjobs = alasql.promise('SELECT MATRIX * FROM CSV("data/JOB-JOB.csv", {headers: true})').then(function(jobs) {
		for (var i = 0; i < jobs.length; i++) {
			alasql('INSERT INTO job VALUES(?,?,?,?,?,?,?,?);', jobs[i]);
		}
	});

	// interviewer
	alasql('DROP TABLE IF EXISTS interview;');
	alasql('CREATE TABLE interview(jobid INT,empid INT);');
	var pinterviewer = alasql.promise('SELECT MATRIX * FROM CSV("data/INTERVIEW-INTERVIEW.csv", {headers: true})').then(function(interviews) {
		for (var i = 0; i < interviews.length; i++) {
			alasql('INSERT INTO interview VALUES(?,?);', interviews[i]);
		}
	});

	// reload html
	Promise.all([ pemp, paddr, pfamily, pedu, pchoice, papplication, ppositions, pjobs, pinterviewer , pdepts]).then(function() {
		window.location.reload(true);
	});
};

DB.remove = function() {
	if (window.confirm('are you sure do delete dababase?')) {
		alasql('DROP localStorage DATABASE EMP')
	}
};

DB.choice = function(id) {
	var choices = alasql('SELECT text FROM choice WHERE id = ?', [ id ]);
	if (choices.length) {
		return choices[0].text;
	} else {
		return '';
	}
};

DB.choices = function(name) {
	return alasql('SELECT id, text FROM choice WHERE name = ?', [ name ]);
};

// connect to database
try {
	alasql('ATTACH localStorage DATABASE EMP');
	alasql('USE EMP');
} catch (e) {
	alasql('CREATE localStorage DATABASE EMP');
	alasql('ATTACH localStorage DATABASE EMP');
	alasql('USE EMP');
	DB.load();
}
