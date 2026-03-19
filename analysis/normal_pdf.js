import { readFileSync } from 'fs';
import { resolve,dirname } from 'path';
import { fileURLToPath } from 'url';
import normalPDF from '@stdlib/stats-base-dists-normal-pdf';
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


var ages = data.map( function( r ) { return r.age; } );
var mu = mean( ages );
var sig = stdev( ages );
var start = Math.round( mu - ( 3.0 * sig ) );
var end = Math.round( mu + ( 3.0 * sig ) );
var maxPDF = normalPDF( mu, mu, sig );
var x;
var density;
var bar;
var marker;

console.log( '=== Age Distribution [Normal PDF] ===' );
console.log( '  mean = ' + mu.toFixed( 1 ) + ' yrs,  std = ' + sig.toFixed( 1 ) + '\n' );
console.log( '  normalPDF(x, \u03BC, \u03C3) \u2014 bell curve\n' );

for ( x = start; x <= end; x += 2 ) {
	density = normalPDF( x, mu, sig );
	bar     = '\u2588'.repeat( Math.round( ( density / maxPDF ) * 30 ) );
	marker  = ( Math.abs( x - Math.round( mu ) ) <= 1 ) ? '  \u2190 mean' : '';
	console.log( '  age ' + String( x ).padStart( 3 ) + ' | ' + bar + marker );
}

console.log('\n');
console.log(` := peak at age ${mu.toFixed(0)}`);
console.log( ` := 68% of patients: ${(mu - sig).toFixed(0)} – ${(mu + sig).toFixed(0)} yrs` );
console.log( ` := 95% of patients: ${(mu - 2 * sig).toFixed(0)}–${(mu + 2 * sig).toFixed(0)} yrs` );