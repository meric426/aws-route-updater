process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

var config = require('devbox-config').get('aws-route53-updater'),
    AWS = require('aws-sdk'),
    ipify = require('ipify');

AWS.config.update({
    accessKeyId: config.aws.id,
    secretAccessKey: config.aws.secret,
    region: config.aws.region
});

var route53 = new AWS.Route53();

ipify(function(err, ip){
    if (err) return console.error(err);

    var params = {
        ChangeBatch: {
            Changes: [
                {
                    Action: 'UPSERT',
                    ResourceRecordSet: {
                        Name: 'home.devbox.com.',
                        Type: 'A',
                        ResourceRecords: [
                            {
                                Value: ip
                            }
                        ],
                        TTL: 3600
                    }
                }
            ]
        },
        HostedZoneId: 'Z3VW1N2MWG2SOR'
    };

    route53.changeResourceRecordSets(params, function(err, data) {
        if (err) return console.log(err, err.stack);

        console.log('updated resource');
    });
});
