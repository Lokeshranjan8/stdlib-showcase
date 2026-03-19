import { readFileSync } from 'fs';
import { resolve,dirname } from 'path';
import { fileURLToPath } from 'url';
import ztest from '@stdlib/stats-ztest';
import * as stats from './Stats.js';
var mean  = stats.mean;
var stdev = stats.stdev;

const dir = dirname(fileURLToPath(import.meta.url));

var file = resolve(dir,'../public/data/heart.csv');
var lines   = readFileSync( resolve( file ), 'utf8' ).trim().split( '\n' );
var headers = lines[ 0 ].split( ',' ).map( function( h ) {
	return h.trim().toLowerCase();
});

var data = lines.slice( 1 ).map( function( line ) {
	var vals = line.split( ',' );
	var row  = {};
	headers.forEach( function( h, i ) {
		row[ h ] = parseFloat( vals[ i ] );
	});
	return row;
}).filter( function( r ) {
	return !isNaN( r.age );
});


var chol    = data.map( function( r ) { return r.chol; } ).filter( function( v ) {
	return !isNaN( v );
});
var mu = mean( chol );
var sig = stdev( chol );
var cholArr = new Float64Array( chol );


var result = ztest( cholArr, sig, { mu: 200, alternative: 'greater' } );

console.log( ' **  Cholesterol Hypothesis Test [Z-Test] **\n' );
console.log( '  H0 : mean cholesterol = 200 mg/dl  (healthy standard)' );
console.log( '  H1 : mean cholesterol > 200 mg/dl  (elevated)\n' );
console.log( '  sample mean   : ' + mu.toFixed( 2 ) + ' mg/dl' );
console.log( '  sample size   : ' + chol.length + ' patients' );
console.log( '  z-statistic   : ' + result.statistic.toFixed( 4 ) );
console.log( '  p-value       : ' + result.pValue.toFixed( 6 ) );
console.log( '  reject H0?    : ' + ( result.rejected ? 'YES (p < 0.05)' : 'NO' ) + '\n' );

if ( result.rejected ) {
	console.log( '  := p-value far below 0.05 -  reject H0' );
	console.log( '  := mean cholesterol (' + mu.toFixed( 1 ) + ' mg/dl) significantly above healthy standard' );
	console.log( '  := population is at elevated cardiovascular risk' );
}