var azure = require('azure-storage');

module.exports.BlobService = function(accountName, accountKey)  {
    accountName = accountName || process.env.AZURE_ACCT;
    accountKey = accountKey || process.env.AZURE_KEY;
    var blobSvc = azure.createBlobService('DefaultEndpointsProtocol=https;AccountName=' + accountName + ';AccountKey=' + accountKey);

    this.get = (container, id, callback) => {
        blobSvc.getBlobToText(container, id, (err, result) => {
            if (err) callback(err.message);
            else callback(result);
        });
    };

    this.post = function (container, id, body, callback) {
        blobSvc.createContainerIfNotExists(container, err => {
            blobSvc.createBlockBlobFromText(container, id, JSON.stringify(body), (err2, result2) => {
                if (!err2)
                callback(body);
                else
                callback(err2);
            });
        });
    };

    this.postAsync = function(container, id, body) {
        return new Promise((resolve, reject) => {
            blobSvc.createContainerIfNotExists(container, err => {
                blobSvc.createBlockBlobFromText(container, id, JSON.stringify(body), (err, result) => {
                    if(err) reject(err);
                    else resolve(body);
                });
            });
        });
    };

    this.listDirectory = (container, prefix, callback) => {
        blobSvc.listBlobsSegmentedWithPrefix(container, prefix, null, (err, result) => {
            if(err) callback(err.message);
            else callback(result);
        });
    }

    this.delete = (container, id, callback) => {
        
        blobSvc.deleteBlobIfExists(container, id, (err, result) => {
            if (err) callback(err.message);
            else callback('success');
        });
    };
}
