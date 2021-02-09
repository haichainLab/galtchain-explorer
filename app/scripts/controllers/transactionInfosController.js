angular.module('ethExplorer')
    .controller('transactionInfosCtrl', function ($rootScope, $scope, $location, $routeParams, $q) {

        var web3 = $rootScope.web3;

        $scope.init = function () {
            $scope.txId = $routeParams.transactionId;

            if ($scope.txId !== undefined) { // add a test to check if it match tx paterns to avoid useless API call, clients are not obliged to come from the search form...

                getTransactionInfos()
                    .then(function (result) {
                        //TODO Refactor this logic, asynchron calls + services....
                        var number = web3.eth.blockNumber;

                        $scope.result = result;

                        // console.log(result)

                        if (result.blockHash !== undefined) {
                            $scope.blockHash = result.blockHash;
                        } else {
                            $scope.blockHash = 'pending';
                        }
                        if (result.blockNumber !== undefined) {
                            $scope.blockNumber = result.blockNumber;
                        } else {
                            $scope.blockNumber = 'pending';
                        }
                        $scope.from = result.from;
                        $scope.gas = result.gas;
                        var gasPrice =result.gasPrice.c[0] ;
                        $scope.gasPrice = web3.fromWei(gasPrice,'ether') + " ";
                        $scope.hash = result.hash;
                        $scope.input = result.input; // that's a string
                        $scope.nonce = result.nonce;
                        $scope.to = result.to;
                        $scope.transactionIndex = result.transactionIndex;
                        $scope.ethValue = result.value.c[0] / 10000;
                        if ($scope.blockNumber !== undefined) {
                            $scope.conf = number - $scope.blockNumber;
                            if ($scope.conf === 0) {
                                $scope.conf = 'unconfirmed'; //TODO change color button when unconfirmed... ng-if or ng-class
                            }
                        }
                        //TODO Refactor this logic, asynchron calls + services....
                        if ($scope.blockNumber !== undefined) {
                            var info = web3.eth.getBlock($scope.blockNumber);
                            if (info !== undefined) {
                                $scope.time = info.timestamp;
                            }
                        }

                        getTransactionReceipt()
                            .then(function (result) {
                                console.log(result)
                                switch (result.to) {
                                    case "0x8cd7c227598428a973662cba04adf6838c68a820":
                                        $scope.tokenFrom = result.logs[0].topics[1].replace("000000000000000000000000", "");
                                        $scope.tokenTo = result.logs[0].topics[2].replace("000000000000000000000000", "");
                                        $scope.gasUsed = result.gasUsed;
                                        $scope.tokenValue = web3.fromWei(parseInt(result.logs[0].data),'ether') + " GXGD";
                                        $scope.txprice = web3.fromWei(result.gasUsed * gasPrice,'ether') + " GALT";

                                        break;
                                    case "0x126129648f82b86c12a61613443feda1cdc2ecb6":
                                        $scope.tokenFrom = result.logs[0].topics[1].replace("000000000000000000000000", "");
                                        $scope.tokenTo = result.logs[0].topics[2].replace("000000000000000000000000", "");
                                        $scope.gasUsed = result.gasUsed;
                                        $scope.tokenValue = web3.fromWei(parseInt(result.logs[0].data),'ether') + " XFJT";
                                        $scope.txprice = web3.fromWei(result.gasUsed * gasPrice,'ether') + " GALT";

                                        break;
                                    default:
                                        $scope.tokenFrom = "0x";
                                        $scope.tokenTo = "0x";
                                        $scope.gasUsed = 0;
                                        $scope.tokenValue = 0;
                                }


                            });







                    });




            } else {
                $location.path("/"); // add a trigger to display an error message so user knows he messed up with the TX number
            }


            function getTransactionInfos() {
                var deferred = $q.defer();

                web3.eth.getTransaction($scope.txId, function (error, result) {
                    if (!error) {
                        deferred.resolve(result);
                    } else {
                        deferred.reject(error);
                    }
                });
                return deferred.promise;

            }

            function getTransactionReceipt() {
                var deferred = $q.defer();

                web3.eth.getTransactionReceipt($scope.txId, function (error, result) {
                    if (!error) {
                        deferred.resolve(result);
                    } else {
                        deferred.reject(error);
                    }
                });
                return deferred.promise;

            }


        };
        $scope.init();
        console.log($scope.result);

    });
