import os
from hashids import Hashids
from time import time


class Hasher:
    """
    NOTE: This class has the Hashids package as a dependency.
    Run 'pip install requirements.txt' to install on your environment.
    Attributes:
        hash_min_length: An integer representing the minimum
            length of an hash.
        timehash_min_length: An integer representing the minimum
            length of the generated time hash.
        alphabet: A string representing available characters to construct
            hash from.
        delim: A string representing the delimiter to be used to
            concatenate the generated hashes.
    """

    timehash_min_length = 40
    hash_min_length = 20
    alphabet = 'abcdefghijklmnopqrstuvwyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    delim = "x"

    secret_key = os.getenv('SECRET_KEY')

    @staticmethod
    def gen_hash(data):
        """Generate a time dependent hash.
        Accept data and return a reversible
        'time-unique' hash for it.
        Args:
            data: An array of strings/ints to be hashed
        Returns:
            A hash composed of a time-stamp hash and one/more
            data-hash delimited by x.
        """
        # get a timestamp (to make each generated hash unique):
        timestamp = int(time() * 1000)

        # encode the timestamp with secret_key:
        hashids = Hashids(
            salt=Hasher.secret_key,
            min_length=Hasher.timehash_min_length,
            alphabet=Hasher.alphabet
        )
        timestamp_hash = hashids.encode(timestamp)

        # encode the data with timestamp:
        hashids = Hashids(
            salt=str(timestamp),
            min_length=Hasher.hash_min_length,
            alphabet=Hasher.alphabet
        )
        hash_array = [
            hashids.encode(datum) for datum in data
        ]
        data_hash = Hasher.delim.join(hash_array)

        # return the combination delimited by Hasher.delim:
        return "%s%s%s" % (timestamp_hash, Hasher.delim, data_hash)

    @staticmethod
    def reverse_hash(hash_str):
        """Reverse a hash parsed from the request URL.
        Accept a unique hash string representing hashed data
        and decode it to return the data.
        Args:
            hash_str: an hash string.
        Returns:
            array of decoded data
            None if there's no decoded data
        """

        # split the hash_str with the delim:
        hashs = hash_str.split(Hasher.delim)

        # ensure the list has more than a part before decoding
        if len(hashs) < 2:
            return None

        # decode the timestamp_hash (i.e hashs[0] )
        # with the app secret key:
        hashids = Hashids(
            salt=Hasher.secret_key,
            min_length=Hasher.timehash_min_length,
            alphabet=Hasher.alphabet
        )
        timestamp = hashids.decode(hashs[0])[0]

        # decode the data_hash with the timestamp:
        hashids = Hashids(
            salt=str(timestamp),
            min_length=Hasher.hash_min_length,
            alphabet=Hasher.alphabet
        )
        data_list = [
            hashids.decode(item)[0] for item in hashs[1:]
        ]
        return data_list
