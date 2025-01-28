'use client';

import { useUser } from '@clerk/nextjs';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../../../firebase';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useRouter, usePathname } from 'next/navigation';

interface FormData {
  title?: string;
  category?: string;
  content?: string;
  image?: string;
}

export default function UpdatePost() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [publishError, setPublishError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const postId = pathname.split('/').pop();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch('/api/post/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId }),
        });
        const data = await res.json();
        if (res.ok) {
          setFormData(data.posts[0]);
        }
      } catch (error: any) {
        console.error(error.message);
      }
    };

    if (isSignedIn && user?.publicMetadata?.isAdmin) {
      fetchPost();
    }
  }, [postId, user?.publicMetadata?.isAdmin, isSignedIn]);

  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError('Please select an image');
      return;
    }
    setImageUploadError(null);

    try {
      const storage = getStorage(app);
      const fileName = `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(parseFloat(progress.toFixed(0)));
        },
        () => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData({ ...formData, image: downloadURL });
          setImageUploadProgress(null);
        }
      );
    } catch (error: any) {
      setImageUploadError('Image upload failed');
      console.error(error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/post/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userMongoId: user?.publicMetadata?.userMongoId,
          postId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
      } else {
        router.push(`/post/${data.slug}`);
      }
    } catch (error: any) {
      setPublishError('Something went wrong');
    }
  };

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn && user?.publicMetadata?.isAdmin) {
    return (
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">Update a post</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            <TextInput
              type="text"
              placeholder="Title"
              required
              id="title"
              defaultValue={formData.title}
              className="flex-1"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <Select
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setFormData({ ...formData, category: e.target.value })
              }
              value={formData.category}
            >
              <option value="uncategorized">Select a category</option>
              <option value="javascript">JavaScript</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
            </Select>
          </div>
          <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
            <FileInput
              type="file"
              accept="image/*"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
            />
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              size="sm"
              outline
              onClick={handleUploadImage}
              disabled={!!imageUploadProgress}
            >
              {imageUploadProgress ? (
                <div className="w-16 h-16">
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0}%`}
                  />
                </div>
              ) : (
                'Upload Image'
              )}
            </Button>
          </div>
          {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
          {formData.image && (
            <img
              src={formData.image}
              alt="upload"
              className="w-full h-72 object-cover"
            />
          )}
          <ReactQuill
            theme="snow"
            placeholder="Write something..."
            className="h-72 mb-12"
            required
            value={formData.content || ''}
            onChange={(value) => setFormData({ ...formData, content: value })}
          />
          <Button type="submit" gradientDuoTone="purpleToPink">
            Update
          </Button>
          {publishError && (
            <Alert className="mt-5" color="failure">
              {publishError}
            </Alert>
          )}
        </form>
      </div>
    );
  }

  return (
    <h1 className="text-center text-3xl my-7 font-semibold min-h-screen">
      You need to be an admin to update a post
    </h1>
  );
}
