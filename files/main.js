var count = 0;
$( "#robotics" ).show();
$('#higgs' ).hide();
$('#neuron' ).hide();
$('#gazebo' ).hide();
$('#gazebo' ).hide();
$( "#accordion" ).hide();

$( "#homeBtn" ).click(function() {
		$( "#accordion" ).hide();
  		$('#intro' ).show();
	});
  	$( "#ProjectBtn" ).click(function() {
	  	$('#intro' ).hide();
	  	$( "#accordion" ).show();
	});

//main function
// setInterval(function main() {

//   	count=changeImage(count);
//   	},10000);
	
// 	function changeImage(count){
// 		switch(count) {
// 		    case 0:
// 		    	$( "#robotics" ).hide();
// 				$('#higgs' ).hide();
// 				$('#neuron' ).hide();
// 				$('#gazebo' ).show();
// 				count = count+1;
// 		        break;
// 		    case 1:
// 		    	count = count+1;
// 		       	$( "#robotics" ).hide();
// 				$('#higgs' ).show();
// 	  			$('#neuron' ).hide();
// 	  			$('#gazebo' ).hide();
// 		        break;
// 		     case 2:
// 		     	count = count+1;
// 		    	$( "#robotics" ).hide();
// 				$('#higgs' ).hide();
// 	  			$('#neuron' ).show();
// 	  			$('#gazebo' ).hide();
// 	  			count = count+1;
// 		        break;
// 	        case 3:
// 				count = count+1;
// 		        $( "#robotics" ).show();
// 				$('#higgs' ).hide();
// 	  			$('#neuron' ).hide();
// 	  			$('#gazebo' ).hide();
// 	        break;

// 		    default:
// 		    	count = 0;
// 		}

// 		return(count);
// 	}
